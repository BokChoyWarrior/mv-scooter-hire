import Scooter, { Dock } from './Scooter';
import Location from './Location';

export default class DockingStation implements Dock {
  // Static
  static all: Map<number, DockingStation> = new Map();

  static nextNamedStation = 0;

  static removeAll() {
    DockingStation.all = new Map();
    this.nextNamedStation = 0;
  }

  // Public
  public id = DockingStation.nextNamedStation;

  public scooters: { [key: string]: Scooter } = {};

  public availableScooters: { [key: string]: Scooter } = {};

  public location: Location;

  // Constructor
  constructor(location: Location = new Location()) {
    this.location = location;
    DockingStation.all.set(this.id, this);
    DockingStation.nextNamedStation += 1;
  }

  // Getters + setters
  get numAvailableScooters() {
    return Object.keys(this.availableScooters).length;
  }

  // Methods
  static findClosestAvailable(location: Location): DockingStation | false {
    let closest: false | DockingStation = false;
    let lowestDistance = Infinity;
    DockingStation.all.forEach((_, index) => {
      const station = DockingStation.all.get(index);
      if (station === undefined || station.numAvailableScooters < 1) {
        return;
      }
      const distance = station.location.distanceTo(location);
      if (closest === false || distance < lowestDistance) {
        lowestDistance = distance;
        closest = station;
      }
    });
    return closest;
  }

  hireScooter(scooter: Scooter) {
    delete this.scooters[scooter.id];
    delete this.availableScooters[scooter.id];
  }

  // Methods required by Dock interface
  /**
   * This method should **NEVER** be called explicitly, other than
   * from {@link Scooter.dock} and {@link App.dock}. You should use
   * the {@link Scooter.dock} and provide the {@link DockingStation} as an arg
   *
   */
  dock(scooter: Scooter, isBroken: boolean = false) {
    this.scooters[scooter.id] = scooter;

    if (isBroken) {
      scooter.fix();
    }

    if (scooter.isAvailable) {
      this.availableScooters[scooter.id] = scooter;
    }
  }

  onNotifyAvailable(scooter: Scooter) {
    this.availableScooters[scooter.id] = scooter;
  }

  onNotifyUnavailable(scooter: Scooter) {
    delete this.availableScooters[scooter.id];
  }
}
