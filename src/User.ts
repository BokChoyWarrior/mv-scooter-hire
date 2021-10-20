import Location from './Location';
import Scooter from './Scooter';

export interface AppMessenger {
  hireFrom(user: User, stationId: number): any;

  findClosestAvailable(location: Location): Location | false;
}

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
  public location;

  public scooterId: number | false = false;

  public previousScooterId: number | false = false;

  public balance; // pence

  constructor(
    name: string,
    age: number,
    location: Location,
    balance: number = 500,
    private messenger: AppMessenger,
  ) {
    this.name = name;
    this.age = age;
    this.location = location;
    this.balance = balance;
    User.all.push(this);
  }

  // Methods
  hireFrom(stationId: number) {
    return this.messenger.hireFrom(this, stationId);
  }

  findNearestAvailableScooter() {
    return this.messenger.findClosestAvailable(this.location);
  }

  dock(stationId: number, isBroken: boolean) {
    PhysicalScooter.dock(stationId, isBroken);
    this.previousScooterId = this.scooterId;
    this.scooterId = false;
  }

  takePayment(batteryUsed: number) {
    this.balance -= batteryUsed * 10;
    return this.balance;
  }

  assign(scooterId: number) {
    this.scooterId = scooterId;
  }
}
