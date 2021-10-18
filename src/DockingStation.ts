import { Scooter } from './Scooter';

export class DockingStation {
  scooters: { [key: string]: Scooter } = {};
  availableScooters: { [key: string]: Scooter } = {};

  constructor() {}

  dock(scooter: Scooter) {
    this.scooters[scooter.id] = scooter;
    console.log('scooter added - available = ', scooter.isAvailable);

    scooter.on('available', () => {
      console.log('Scooter now available!', scooter.id);
      this.availableScooters[scooter.id] = scooter;
    });

    scooter.on('unavailable', () => {
      console.log('unavailable!!', scooter.id);
      // remove from pool . . .
    });
  }
}
