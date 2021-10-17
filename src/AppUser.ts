import { Scooter } from './Scooter';
import { DockingStation } from './DockingStation';
export class AppUser {
  constructor(name: string, age: number) {
    if (age < 18) {
      return new Error('User must be 18 or over');
    }
  }
}
