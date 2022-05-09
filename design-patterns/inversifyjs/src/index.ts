import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior, Weapon } from "./interfaces";

// Resolves a dependency by its runtime identifier which is TYPES.Weapon. 
//The runtime identifier must be associated with only ONE binding and the binding must be synchronously resolved, otherwise an error is thrown:
const weapon = myContainer.get<Weapon>(TYPES.Weapon);

console.log(weapon.hit());
