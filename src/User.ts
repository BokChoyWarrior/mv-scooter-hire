import Location from './Location';
import Scooter, { Dock } from './Scooter';
import DockingStation from './DockingStation';

export interface UserApp {
  hireFrom(user: User, station: DockingStation): Scooter;

  findClosestAvailable(location: Location): DockingStation | false;
}

/**
 * To use the User class and interact with the whole system from a user's perspective,
 * one must construct a User with an `app` property which implements the {@link UserApp}
 * interface.
 *
 * The user can then hire scooters, check for available scooters, and pay,
 * all via the {@link UserApp} interface provided.
 *
 * @example
 * ```
 * const app = new App()
 * const user = new User("name", 50, app)
 * ```
 *
 */
export default class User {
  // Statics
  static all: User[] = [];

  static removeAll() {
    User.all = [];
  }

  // Private
  private age;

  private name;

  // Public
  public location: Location;

  public scooter: Scooter | false = false;

  public previousScooter: Scooter | false = false;

  public balance: number; // pence

  constructor(
    name: string,
    age: number,
    private app: UserApp,
    location: Location = new Location(),
  ) {
    this.name = name;
    this.age = age;
    this.location = location;
    this.balance = 1500;
    User.all.push(this);
  }

  // Methods
  hireFrom(station: DockingStation) {
    this.scooter = this.app.hireFrom(this, station);
    return this.scooter;
  }

  takePayment(batteryUsed: number) {
    this.balance -= 10 * batteryUsed;
  }

  // Methods from UserApp
  findNearestAvailableScooter() {
    return this.app.findClosestAvailable(this.location);
  }

  dock(station: Dock, isBroken: boolean = false) {
    if (!this.scooter) {
      throw new Error('User cannot dock a scooter they do not own');
    }
    this.scooter.dock(station, isBroken);

    this.previousScooter = this.scooter;
    this.scooter = false;
    this.takePayment(100 - this.previousScooter.batteryPercent);
  }
}
