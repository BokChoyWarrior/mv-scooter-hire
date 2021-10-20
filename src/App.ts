import DockingStation from './DockingStation';
import Location from './Location';
import Scooter from './Scooter';
import User from './User';

export class App implements AppMessenger {
  static dockingStations: DockingStation[] = [];

  static scooters: Scooter[] = [];

  constructor(private messenger: AppMessenger) {}

  static dock(stationId: any, isBroken: boolean) {
    throw new Error('Method not implemented.');
  }

  static hire(stationId: number, arg1: this) {
    throw new Error('Method not implemented.');
  }

  static findNearestDockWithAvailableScooter(location: Location) {
    throw new Error('Method not implemented.');
  }

  hire(user: User, stationId: number) {
    if (stationId === 0) {
      return this.availableLocation;
    }
    return false;
  }
}

export interface AppMessenger {
  send(): object;
}
