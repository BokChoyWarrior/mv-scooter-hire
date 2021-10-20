import { DockingStation } from './DockingStation';
import { Location } from './Location';
import { Scooter } from './Scooter';

const scooter = new Scooter();
const station = new DockingStation(new Location());

scooter.batteryPercent = 1;
station.dock(scooter);

console.log(station.scooters, station.availableScooters);

scooter.charge();
