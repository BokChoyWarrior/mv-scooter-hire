import { DockingStation } from '../src/DockingStation';
import { Location } from '../src/Location';
import { Scooter } from '../src/Scooter';
import { User } from '../src/User';

describe('the DockingStation class', () => {
  const dockingStation1 = new DockingStation(new Location(1, 1));
  const dockingStation2 = new DockingStation(new Location(2, 2));
  const availableScooter1 = new Scooter();
  const availableScooter2 = new Scooter();
  const user = new User('test user', 21, new Location(0, 0));
  it("shouldn't give the user a station if none have any scooters", () => {
    expect(DockingStation.findNearestDockWithAvailableScooter(user.location)).toEqual(false);
  });

  it('should give a station if it has a scooter available', () => {
    dockingStation2.dock(availableScooter2);
    expect(DockingStation.findNearestDockWithAvailableScooter(user.location)).toEqual(dockingStation2);
  });

  it('should give a closer station if the closer station has available scooters', () => {
    dockingStation1.dock(availableScooter1);
    expect(DockingStation.findNearestDockWithAvailableScooter(user.location)).toEqual(dockingStation1);
  });

  it('should give a further station if a scoooter closer becomes unavailable', () => {
    availableScooter1.isBroken = true;
    expect(DockingStation.findNearestDockWithAvailableScooter(user.location)).toEqual(dockingStation2);
  });
});
