import Location from './Location';
import User, { UserApp } from './User';

export default class Person {
  name;

  age;

  location;

  constructor(name: string, age: number, location: Location = new Location()) {
    this.name = name;
    this.age = age;
    this.location = location;
  }

  register(app: UserApp) {
    if (this.age < 18) {
      throw new Error('You muat be 18 years of age to register');
    } else {
      return new User(this.name, this.age, app, this.location);
    }
  }
}
