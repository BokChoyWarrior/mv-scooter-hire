import { Location } from './Location';
import { User } from './User';

export class Person {
  name;
  age;
  location;
  constructor(name: string, age: number, location: Location) {
    this.name = name;
    this.age = age;
    this.location = location;
  }

  register() {
    if (this.age < 18) {
      throw new Error('You muat be 18 years of age to register');
    } else {
      return new User(this.name, this.age, this.location);
    }
  }
}
