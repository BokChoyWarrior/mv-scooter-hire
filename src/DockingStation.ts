import { Location } from './Location';
import { Scooter } from './Scooter';
import { User } from './User';

export class DockingStation {
  static all: DockingStation[] = [];

  static removeAll() {
    DockingStation.all = [];
  }

  // This function finds the closest station to a user with available scooters
  // We could set up a listener for whether the station runs out of scooters, but I will consider that out of scope
  public static findNearestDockWithAvailableScooter(user: User): DockingStation | false {
    const userLoc = user.location;

    let nearest: false | DockingStation = false;
    let lowestDistance = Infinity;
    for (let station of DockingStation.all) {
      if (station.numAvailableScooters < 1) {
        continue;
      }
      let distance = station.location.distanceTo(user.location);
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
  private listeners: { [key: string]: Function[] } = {};

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
  dock(scooter: Scooter) {
    // add scooter to list of scooters
    this.scooters[scooter.id] = scooter;
    if (scooter.isAvailable) {
      this.availableScooters[scooter.id] = scooter;
    }
    // Setup listeners
    const availableListener = () => {
      this.availableScooters[scooter.id] = scooter;
    };

    const unavailableListener = () => {
      delete this.availableScooters[scooter.id];
    };

    scooter.on('available', availableListener);
    scooter.on('unavailable', unavailableListener);

    this.listeners[scooter.id] = [];
    this.listeners[scooter.id] = [availableListener, unavailableListener];
  }

  assign(scooter: Scooter, user: User) {
    delete this.scooters[scooter.id];
  }
}
