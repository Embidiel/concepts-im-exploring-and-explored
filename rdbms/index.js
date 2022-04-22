const { Pool } = require("pg");
const pgformat = require("pg-format");

const Chance = require("chance");

const chance = new Chance();

const pool = new Pool({
  user: "postgres",
  database: "indexing_demo",
  password: "admin",
});

const EVENTS = {
  ERROR: "error",
};

let firstNameToBeSearched = "";

pool.on(EVENTS.ERROR, (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const generatedDummyRecords = async (len = 100) => {
  let records = [];
  const picked = chance.integer({ min: 0, max: len });
  for (let ctr = 0; ctr < len; ctr++) {
    const first_name = chance.name();
    const last_name = chance.last();
    const city = chance.city();
    const record = [first_name, last_name, city];

    if (ctr === picked) {
      firstNameToBeSearched = first_name;
      console.log(`Lucky: `, firstNameToBeSearched);
    }

    records.push(record);
  }
  return records;
};

const createTable = async (rdbmsClient, tableName, ...columns) => {
  const tableColumns = columns.reduce((acc, col, currIdx) => {
    const isArrayEnd = columns.length - 1 === currIdx;
    const delimiter = isArrayEnd ? "" : ",";
    acc = `${acc}${col.name} ${col.dataTypeAndLen}${delimiter}`;
    return acc;
  }, ``);
  const qry = `CREATE TABLE ${tableName} (
        ${tableColumns}
    )`;

  try {
    const res = await rdbmsClient.query(qry);
    return res;
  } catch (err) {
    throw { fname: `createTable`, err };
  }
};

const insertRows = async (
  rdbmsClient,
  tableName,
  columns,
  dataToBeInserted
) => {
  const qry = `INSERT INTO ${tableName} ${columns} VALUES %L`;
  const escaped = pgformat(qry, dataToBeInserted);

  try {
    const res = await rdbmsClient.query(escaped);
    return res;
  } catch (err) {
    throw { fname: `insertRows`, err };
  }
};

const selectRows = async (
  rdbmsClient,
  tableName,
  columns,
  where,
  data,
  benchmark = false
) => {
  let qry = `${
    benchmark ? "explain analyze" : ""
  } SELECT ${columns} FROM ${tableName}`;

  if (where) {
    qry = `${qry} WHERE ${where}`;
  }

  try {
    const escaped = pgformat(qry, data);
    const res = await rdbmsClient.query(escaped);
    return res;
  } catch (err) {
    throw { fname: `selectRows`, err };
  }
};

const createIndex = async (rdbmsClient, idxName, tableName, columns) => {
  let qry = `CREATE INDEX ${idxName}
  ON ${tableName} ${columns}`;

  try {
    const res = await rdbmsClient.query(qry);
    return res;
  } catch (err) {
    throw { fname: `createIndex`, err };
  }
};

const dropTable = async () => {};

const TABLE_NAME = "Person";
const DT_VARCHAR = (len = 255) => `varchar(${len})`;

const start = async () => {
  const client = await pool.connect();
  try {
    const table = await createTable(
      client,
      TABLE_NAME,
      { name: "first_name", dataTypeAndLen: DT_VARCHAR() },
      { name: "last_name", dataTypeAndLen: DT_VARCHAR() },
      { name: "city", dataTypeAndLen: DT_VARCHAR(20) }
    );

    //console.log(`Table Created ${table}`);
    const records = await generatedDummyRecords(100000);
    const inserted = await insertRows(
      client,
      TABLE_NAME,
      `(first_name, last_name, city)`,
      records
    );

    const { rows: rowsPreIndex } = await selectRows(
      client,
      TABLE_NAME,
      `first_name`,
      `first_name = %L`,
      firstNameToBeSearched,
      true
    );
    console.log(
      `Normal / No Index Search / Full Table Search`,
      rowsPreIndex[4]
    );

    const index = await createIndex(
      client,
      `idx_first_name`,
      TABLE_NAME,
      `(first_name)`
    );

    console.log(`Created index`);

    const { rows: rowsPostIndex } = await selectRows(
      client,
      TABLE_NAME,
      `first_name`,
      `first_name = %L`,
      firstNameToBeSearched,
      true
    );

    console.log(`Indexed`, rowsPostIndex[6]);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

start().then((res) => {
  //   console.log(res);
});
