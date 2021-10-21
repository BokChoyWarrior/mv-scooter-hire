import Scooter, { Dock } from './Scooter';
import Location from './Location';

export default class DockingStation implements Dock {
  static all: Map<number, DockingStation> = new Map();

  static lastNamedStation = 0;

  static removeAll() {
    DockingStation.all = new Map();
  }
  // END static

  // Public
  id = DockingStation.lastNamedStation + 1;

  public scooters: { [key: string]: Scooter } = {};

  public availableScooters: { [key: string]: Scooter } = {};

  public location: Location;

  // Constructor
  constructor(location: Location = new Location()) {
    this.location = location;
    DockingStation.all.set(this.id, this);
    DockingStation.lastNamedStation = this.id;
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

  /**
   * Automatically decides what to do whether supplied argument is a {@link User} or {@link Scooter}
   *
   * @param thing
   */
  dock(scooter: Scooter, isBroken: boolean = false) {
    this.scooters[scooter.id] = scooter;

    scooter._dock(this, isBroken);

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

  hireScooter(scooter: Scooter) {
    delete this.scooters[scooter.id];
    delete this.availableScooters[scooter.id];
  }
}
