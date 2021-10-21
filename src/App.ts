import DockingStation from './DockingStation';
import Location from './Location';
import User, { UserApp } from './User';

export default class App implements UserApp {
  users: User[] = [];

  // eslint-disable-next-line class-methods-use-this
  hireFrom(user: User, station: DockingStation) {
    if (user.balance <= 0) {
      throw new Error('Insufficient balance');
    }

    if (station.numAvailableScooters === 0) {
      throw new Error('The station selected has no available scooters');
    }

    // Choose a random scooter from availableScooters
    const Ids = Object.keys(station.availableScooters);
    // Magic rounding
    // eslint-disable-next-line no-bitwise
    const scooterId = Ids[(Ids.length * Math.random()) << 0];
    const scooter = station.availableScooters[scooterId];

    station.hireScooter(scooter);
    scooter.isHired = true;
    return scooter;
  }

  // eslint-disable-next-line class-methods-use-this
  findClosestAvailable(location: Location): DockingStation | false {
    return DockingStation.findClosestAvailable(location);
  }
}
