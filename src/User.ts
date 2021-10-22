import { Location } from '../src/Location';
import { DockingStation } from '../src/DockingStation';
import { Scooter } from '../src/Scooter';

/**
 * The {@link User} class represents an actual user: what they can do on the app as well as the
 * physical world.
 *
 */
export class User {
  // Statics
  static all: User[] = [];

  static removeAll() {
    User.all = [];
  }

  // Private
  private age;
  private name;

  // Public
  public location;
  public scooter: Scooter | false = false;
  public previousScooter: Scooter | false = false;
  public balance; // pence

  constructor(name: string, age: number, location: Location, balance: number = 500) {
    this.name = name;
    this.age = age;
    this.location = location;
    this.balance = balance;
    User.all.push(this);
  }

  // Methods
  findNearestAvailableStation() {
    return DockingStation.findNearestDockWithAvailableScooter(this.location);
  }

  hireFrom(station: DockingStation): Scooter {
    if (this.balance <= 0) {
      throw new Error('Insufficient balance');
    }
    if (!!this.scooter) {
      throw new Error('User already has a scooter');
    }

    const scooter = station.hire();

    this.scooter = scooter;

    return scooter;
  }

  dock(station: DockingStation, isBroken: boolean = false) {
    if (!this.scooter) {
      throw new Error(`User ${this.name} doesn't have a scooter to dock!`);
    }
    const batteryUsed = 100 - this.scooter.batteryPercent;
    this._takePayment(batteryUsed);
    station.dock(this.scooter, isBroken);
    this.previousScooter = this.scooter;
    this.scooter = false;
  }

  _takePayment(batteryUsed: number) {
    this.balance -= batteryUsed * 10;
    return this.balance;
  }
}
