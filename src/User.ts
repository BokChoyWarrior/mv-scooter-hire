import { Location } from '../src/Location';
import { DockingStation } from '../src/DockingStation';
import { Scooter } from '../src/Scooter';

// DockingStation class will *mostly* act as the "app" and the user will interact with the "app" via DockingStation
// This should really be all in it's own "App" class, but the proogram is already complicated enough as-is!
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
    return DockingStation.findNearestDockWithAvailableScooter(this);
  }

  hireFrom(station: DockingStation) {
    return station.hire(this);
  }

  dock(station: DockingStation) {
    station.dock(this);
  }

  takePayment(batteryUsed: number) {
    this.balance -= batteryUsed * 10;
    return this.balance;
  }

  markPrevScooterBroken() {
    if (!this.previousScooter) {
      throw new Error("User can't mark the prev ride as broken if they haven't ridden yet");
    }
    this.previousScooter.isBroken = true;
    // ??????
  }
}
