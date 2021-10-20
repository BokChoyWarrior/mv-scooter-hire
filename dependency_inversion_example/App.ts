import Location from '../src/Location';
import { User, AppMessenger } from './User';

export default class App implements AppMessenger {
  availableLocation: Location = new Location();

  users;

  constructor(users: User[] = []) {
    this.users = users;
  }

  hire(user: User, stationId: number) {
    if (stationId === 0) {
      console.log('App recieved HIRE', user);
      return this.availableLocation;
    }
    return false;
  }

  findClosestAvailable();
}
