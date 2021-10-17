import { Scooter } from './Scooter';
import { DockingStation } from './DockingStation';

const scooter = new Scooter();
const station = new DockingStation();

scooter.batteryLevel = 1;
station.dock(scooter);

console.log(station.scooters, station.availableScooters);

scooter.charge();
