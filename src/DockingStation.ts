import User from './User';
import Scooter from './Scooter';
import Location from './Location';

export default class DockingStation {
  static all: DockingStation[] = [];

  static removeAll() {
    DockingStation.all = [];
  }

  /**
   * Does what it says on the tin!
   */
  public static findNearestDockWithAvailableScooter(user: User): DockingStation | false {
    let nearest: false | DockingStation = false;
    let lowestDistance = Infinity;
    DockingStation.all.forEach((station) => {
      if (station.numAvailableScooters < 1) {
        return;
      }
      const distance = station.location.distanceTo(user.location);
      if (nearest === false || distance < lowestDistance) {
        lowestDistance = distance;
        nearest = station;
      }
    });

    if (nearest === false) {
      return false;
    }
    return nearest;
  }
  // END static

  // Public
  public scooters: { [key: string]: Scooter } = {};

  public availableScooters: { [key: string]: Scooter } = {};

  public location: Location;

  // Private
  private listeners: {
    [key: string]: {
      availableListener: (eventName: string) => void;
      unavailableListener: (eventName: string) => void;
    };
  } = {};

  // Constructor
  constructor(location: Location) {
    this.location = location;
    DockingStation.all.push(this);
  }

  // Getters + setters
  get numAvailableScooters() {
    let num = 0;
    Object.keys(this.availableScooters).forEach(() => {
      num += 1;
    });
    return num;
  }

  // Methods
  /**
   * Automatically decides what to do whether supplied argument is a {@link User} or {@link Scooter}
   *
   * @param thing
   */
  dock(thing: User | Scooter, isBroken: boolean = false) {
    if (thing instanceof User) {
      this._userDock(thing, isBroken);
    } else {
      this._scooterDock(thing);
    }
  }

  private _userDock(user: User, isBroken: boolean) {
    if (!user.scooter) {
      throw new Error("scooter not given - maybe the user doesn't have one assigned?");
    }

    this._scooterDock(user.scooter, isBroken);

    const batteryUsed = 100 - user.scooter.batteryPercent;
    user.takePayment(batteryUsed);
  }

  private _scooterDock(scooter: Scooter, isBroken: boolean = false) {
    // add scooter to list of scooters
    this.scooters[scooter.id] = scooter;

    this.addListeners(scooter);
    scooter.dock(isBroken);

    if (isBroken) {
      scooter.fix();
    }
    scooter.charge();
    if (scooter.isAvailable) {
      this.availableScooters[scooter.id] = scooter;
    }
  }

  hire(user: User): Scooter {
    if (user.balance <= 0) {
      throw new Error('Insufficient balance');
    }
    if (this.numAvailableScooters === 0) {
      throw new Error('The station selected has no available scooters');
    }

    // Choose a random scooter from availableScooters
    const Ids = Object.keys(this.availableScooters);
    // eslint-disable-next-line no-bitwise
    const scooterId = Ids[(Ids.length * Math.random()) << 0];

    const scooter = this.availableScooters[scooterId];
    this.removeListeners(scooter);
    this._assign(scooter, user);
    scooter.isHired = true;
    return scooter;
  }

  private _assign(scooter: Scooter, user: User) {
    delete this.scooters[scooter.id];
    delete this.availableScooters[scooter.id];
    user.assign(scooter);
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

    this.listeners[scooter.id] = {
      availableListener,
      unavailableListener,
    };
  }

  removeListeners(scooter: Scooter) {
    scooter.off('available', this.listeners[scooter.id].availableListener);
    scooter.off('unavailable', this.listeners[scooter.id].unavailableListener);
  }
}
