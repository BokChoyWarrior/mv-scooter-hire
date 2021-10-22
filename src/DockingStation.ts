import { Location } from './Location';
import { Scooter } from './Scooter';

/**
 * A physical docking/charging station which holds {@link Scooter scooters}. Has knowledge of which scooters are
 * docked within it, as well as their availability status.
 */
export class DockingStation {
  static all: DockingStation[] = [];

  static removeAll() {
    DockingStation.all = [];
  }

  public static findNearestDockWithAvailableScooter(location: Location): DockingStation | false {
    let nearest: false | DockingStation = false;
    let lowestDistance = Infinity;
    for (let station of DockingStation.all) {
      if (station.numAvailableScooters < 1) {
        continue;
      }
      let distance = station.location.distanceTo(location);
      if (nearest === false || distance < lowestDistance) {
        lowestDistance = distance;
        nearest = station;
      }
    }

    if (nearest === false) {
      return false;
    } else {
      return nearest;
    }
  }
  // END static

  // Public
  public scooters: { [key: string]: Scooter } = {};
  public availableScooters: { [key: string]: Scooter } = {};
  public location: Location;

  // Private
  private listeners: {
    [key: string]: { availableListener: (eventName: string) => void; unavailableListener: (eventName: string) => void };
  } = {};

  // Constructor
  constructor(location: Location) {
    this.location = location;
    DockingStation.all.push(this);
  }

  // Getters + setters
  get numAvailableScooters() {
    let num = 0;
    for (let scooter in this.availableScooters) {
      num += 1;
    }
    return num;
  }

  // Methods
  dock(scooter: Scooter, isBroken: boolean = false) {
    // add scooter to list of scooters
    this.scooters[scooter.id] = scooter;
    scooter.isHired = false;

    this.addListeners(scooter);

    scooter.isBroken = isBroken;
    if (isBroken) {
      scooter.fix();
    }
    scooter.charge();
    if (scooter.isAvailable) {
      this.availableScooters[scooter.id] = scooter;
    }
  }

  hire() {
    if (this.numAvailableScooters === 0) {
      throw new Error('The station selected has no available scooters');
    }
    let scooterId;
    const Ids = Object.keys(this.availableScooters);
    scooterId = Ids[(Ids.length * Math.random()) << 0];
    const scooter = this.availableScooters[scooterId];

    this.removeListeners(scooter);
    delete this.scooters[scooterId];
    delete this.availableScooters[scooterId];
    scooter.isHired = true;

    return scooter;
  }

  addListeners(scooter: Scooter) {
    const availableListener = () => {
      this.availableScooters[scooter.id] = scooter;
    };

    const unavailableListener = () => {
      delete this.availableScooters[scooter.id];
    };

    scooter.on('available', availableListener);
    scooter.on('unavailable', unavailableListener);

    this.listeners[scooter.id] = { availableListener: availableListener, unavailableListener: unavailableListener };
  }

  removeListeners(scooter: Scooter) {
    scooter.off('available', this.listeners[scooter.id].availableListener);
    scooter.off('unavailable', this.listeners[scooter.id].unavailableListener);
  }
}
