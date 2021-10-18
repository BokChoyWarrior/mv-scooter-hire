import { DockingStation } from '../src/DockingStation';
import { Location } from '../src/Location';
import { Scooter } from '../src/Scooter';
import { User } from '../src/User';

// Example environment for testing purposes
export function setupMockEnvironment(): { scooters: Scooter[]; users: User[]; stations: DockingStation[] } {
  const mockValues = {
    scooters: [new Scooter(), new Scooter()],
    users: [new User('test1', 25, new Location(0, 0)), new User('test2', 22, new Location(1, 1))],
    stations: [new DockingStation(new Location(0, 0)), new DockingStation(new Location(1, 1))],
  };

  return mockValues;
}

export function teardownMockEnvironment() {
  Scooter.removeAll();
  User.removeAll();
  DockingStation.removeAll();
}
