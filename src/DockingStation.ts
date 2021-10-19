import { Location } from './Location';
import { Scooter } from './Scooter';
import { User } from './User';

export class DockingStation {
  static all: DockingStation[] = [];

  static removeAll() {
    DockingStation.all = [];
  }

  /**
   * Does what it says on the tin!
   */
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
  /**
   * Automatically decides what to do whether supplied argument is a `User` or `Scooter`
   *
   * @param thing
   */
  dock(thing: User | Scooter) {
    if (thing instanceof User) {
      this._userDock(thing);
    } else {
      this._scooterDock(thing);
    }
  }
  _userDock(user: User) {
    if (!user.scooter) {
      throw new Error("scooter not given - maybe the user doesn't have one assigned?");
    }
    const batteryUsed = 100 - user.scooter.batteryLevel;
    this._scooterDock(user.scooter);
    // TODO
    // this.takePayment(user, batteryUsed)

    user.previousScooter = user.scooter;
    user.scooter = false;

    user.takePayment(batteryUsed);
  }

  _scooterDock(scooter: Scooter) {
    // add scooter to list of scooters
    this.scooters[scooter.id] = scooter;
    scooter.isHired = false;
    scooter.charge();
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

  hire(user: User): Scooter {
    if (user.balance <= 0) {
      throw new Error('Insufficient balance');
    }
    if (this.numAvailableScooters === 0) {
      throw new Error('The station selected has no available scooters');
    }

    // Choose a random scooter from availableScooters
    let scooterId;
    const Ids = Object.keys(this.availableScooters);
    scooterId = Ids[(Ids.length * Math.random()) << 0];

    const scooter = this.availableScooters[scooterId];
    this._assign(scooter, user);
    scooter.isHired = true;
    return scooter;
  }

  private _assign(scooter: Scooter, user: User) {
    delete this.scooters[scooter.id];
    delete this.availableScooters[scooter.id];
    user.scooter = scooter;
  }
}
