// Couple dependencies together in a composite / container.

import { Container } from "inversify";
import { TYPES } from "./types";
import { Warrior, Weapon, ThrowableWeapon } from "./interfaces";
import { Ninja, Katana, Shuriken } from "./entities";

const myContainer = new Container();

// Leaf can be hot swappable, If I want to change the weapon in a given scenario, it would be easy. 
//The Ninja class won't have to know what SPECIFIC weapon is I'm going to insert.
// Injection is happening via the container. You wont have to change the ninja class.
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export { myContainer };
