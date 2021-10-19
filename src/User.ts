import { Location } from '../src/Location';

// DockingStation class will act as the "app" and the user will interact with the "app" via DockingStation
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

  constructor(name: string, age: number, location: Location) {
    this.name = name;
    this.age = age;
    this.location = location;
    User.all.push(this);
  }

  // Methods
}
