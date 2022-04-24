const { Pool } = require("pg");
const pgformat = require("pg-format");

const Chance = require("chance");

const process = require("process");
const { off } = require("process");

// Printing process.argv property value
const args = process.argv;

const paginationType = args[2];
const page = parseInt(args[3]);
const order = args[4];

const PAGE_TYPES = {
  OFFSET: "offset",
  SEEK: "seek",
};

const chance = new Chance();

const pool = new Pool({
  user: "postgres",
  database: "indexing_demo",
  password: "admin",
});

const EVENTS = {
  ERROR: "error",
};

let personToBeSearched = {};

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
      personToBeSearched = { picked, first_name, last_name, city };
      console.log(`Lucky! : `, personToBeSearched);
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

const dropIndex = async (rdbmsClient, indexName) => {
  const qry = `DROP INDEX ${indexName}`;

  try {
    const res = await rdbmsClient.query(qry);
    return res;
  } catch (err) {
    throw { fname: `dropIndex`, err };
  }
};

const dropTable = async (rdbmsClient, tableName) => {
  const qry = `DROP TABLE ${tableName}`;

  try {
    const res = await rdbmsClient.query(qry);
    return res;
  } catch (err) {
    throw { fname: `dropTable`, err };
  }
};

const TABLE_NAME = "Person";
const DT_VARCHAR = (len = 255) => `varchar(${len})`;

const offsetPaginate = async (
  rdbmsClient,
  limit = 5,
  page = 0,
  order = "ASC"
) => {
  let qry = `SELECT * FROM Person ORDER BY person_id ${order} LIMIT ${limit} OFFSET ${
    page * limit
  }`;

  try {
    const res = await rdbmsClient.query(qry);
    return res;
  } catch (err) {
    throw { fname: `offsetPaginate`, err };
  }
};

const seek = async (rdbmsClient, limit = 5, page = 0, order = "ASC") => {
  let qry = `SELECT * FROM Person WHERE person_id > ${
    page * limit
  } ORDER BY last_name ASC, person_id ${order} LIMIT ${limit}`;

  console.log(qry);
  try {
    const res = await rdbmsClient.query(qry);
    return res;
  } catch (err) {
    throw { fname: `seek`, err };
  }
};

const start = async () => {
  const client = await pool.connect();
  try {
    // const table = await createTable(
    //   client,
    //   TABLE_NAME,
    //   { name: "person_id", dataTypeAndLen: "serial primary key" },
    //   { name: "first_name", dataTypeAndLen: DT_VARCHAR() },
    //   { name: "last_name", dataTypeAndLen: DT_VARCHAR() },
    //   { name: "city", dataTypeAndLen: DT_VARCHAR(20) }
    // );

    // console.log(`Table Created ${table}`);
    // const records = await generatedDummyRecords(150000);
    // const inserted = await insertRows(
    //   client,
    //   TABLE_NAME,
    //   `(first_name, last_name, city)`,
    //   records
    // );

    // const singleColIndex = await createIndex(
    //   client,
    //   `idx_first_name`,
    //   TABLE_NAME,
    //   `(first_name)`
    // );

    if (PAGE_TYPES.OFFSET === paginationType) {
      const offsetted = await offsetPaginate(client, 5, page, order);
      console.table(offsetted.rows);
    } else if (PAGE_TYPES.SEEK === paginationType) {
      const seeked = await seek(client, 5, page, order);
      console.table(seeked.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    // const droppedTable = await dropTable(client, TABLE_NAME);
    // console.log(`Dropped Table ${TABLE_NAME}`);
  }
};

start().then((res) => {
  //   console.log(res);
});
