import DockingStation from '../src/DockingStation';
import Location from '../src/Location';
import Scooter from '../src/Scooter';
import User from '../src/User';
import App from '../src/App';

let app: App = new App();
let user: User = new User('Test User', 20, app);
let stationClose: DockingStation = new DockingStation();
let stationFar: DockingStation = new DockingStation(new Location(2, 2));
let scooter1: Scooter = new Scooter();
let scooter2: Scooter = new Scooter();

describe('the DockingStation class', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    app = new App();
    user = new User('Test User', 20, app);
    stationClose = new DockingStation();
    stationFar = new DockingStation(new Location(2, 2));
    scooter1 = new Scooter();
    scooter2 = new Scooter();
  });
  afterEach(() => {
    jest.useRealTimers();
    DockingStation.removeAll();
    User.removeAll();
    Scooter.removeAll();
  });

  it("shouldn't give the user a station if none have any scooters", () => {
    expect(user.findNearestAvailableScooter()).toEqual(false);
  });

  it('should give a station if it has a scooter available', () => {
    stationFar.dock(scooter2);
    const nearest = user.findNearestAvailableScooter();
    if (!nearest) return;
    expect(nearest.id).toEqual(stationFar.id);
  });

  it('should give a closer station if the closer station has available scooters', () => {
    stationClose.dock(scooter1);
    const nearest = user.findNearestAvailableScooter();
    if (!nearest) return;
    expect(nearest.id).toEqual(stationClose.id);
  });

  it('should give a further station if a scoooter closer becomes unavailable', () => {
    scooter1.isBroken = true;
    const nearest = user.findNearestAvailableScooter();
    if (!nearest) return;
    expect(nearest.id).toEqual(stationFar.id);
  });

  it('should give the correct station when scooters are moved', () => {
    stationFar.dock(scooter1);
    user.hireFrom(stationFar);
    jest.advanceTimersByTime(5000);
    user.dock(stationClose);
    jest.runAllTimers();

    const nearest = user.findNearestAvailableScooter();

    expect(nearest).not.toBe(false);
    if (!nearest) {
      return;
    }
    expect(nearest.id).toBe(stationClose.id);
  });

  it('should correctly find the closest station', () => {
    const stationMidway = new DockingStation(new Location(1, 0));
    stationFar.dock(scooter1);
    stationMidway.dock(scooter2);

    const nearest = user.findNearestAvailableScooter();

    expect(nearest).not.toBe(false);
    if (!nearest) {
      return;
    }

    expect(nearest.id).toBe(1);
  });
});
