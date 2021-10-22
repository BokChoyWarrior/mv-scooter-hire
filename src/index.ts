// @ts-nocheck
// ^ Important otherwise we have to check for false values all the time x)
// Install ts-node globally `npm i -g ts-node` and then run `ts-node src` to run this file
import { DockingStation } from './DockingStation';
import { Scooter } from './Scooter';
import { User } from './User';
import { Location } from './Location';

const station1 = new DockingStation(new Location(1, 1));
const station2 = new DockingStation(new Location(5, 10));
const scoot1 = new Scooter();
const scoot2 = new Scooter();
station1.dock(scoot1);
station2.dock(scoot2);

// balance is optional
const user1 = new User('Daniel Miller', 30, new Location(2, 2));

// You should then be able to interact with the whole system from a user's PoV
const nearest = user1.findNearestAvailableStation();
console.log(nearest.location); // { x: 1, y: 1}

user1.hireFrom(nearest);
console.log(user1.scooter.id);

// . . .
const broken = true;
user1.dock(station2, broken);

/*
  ==========================================================================
  For testing sake, you can also bypass the whole user object by
  directly calling methods on Scooter/DockingStation 
 
 */
const scoot3 = new Scooter();
const station3 = new DockingStation(new Location());

scoot3.batteryPercent = 0;
station3.dock(scoot3);
console.log(scoot3.chargingPromise);
(async () => {
  scoot3.chargingPromise.then(() => {
    console.log(scoot3.batteryPercent);
  });
})(); // IIFE to use async in the base file
