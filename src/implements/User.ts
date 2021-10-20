import Location from '../Location';

export class User {
  constructor(private messenger: AppMessenger) {}

  hireFrom(stationId: number) {
    return this.messenger.hire(this, stationId);
  }
}

export interface AppMessenger {
  hire(user: User, stationId: number): any;

  findClosestAvailable(location: Location): Location | false;
}
