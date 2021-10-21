import Scooter from '../src/Scooter';
import DockingStation from '../src/DockingStation';
import User from '../src/User';
import App from '../src/App';

let app: App = new App();
let user: User = new User('Test User', 20, app);
let station: DockingStation = new DockingStation();
let scooter: Scooter = new Scooter();

describe('the Scooter class', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    app = new App();
    user = new User('Test User', 20, app);
    station = new DockingStation();
    scooter = new Scooter();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should charge', () => {
    scooter.batteryPercent = 0;

    scooter.charge();
    jest.runAllTimers();

    expect(scooter.batteryPercent).toBe(100);
  });

  it('should be fixed properly', () => {
    scooter.isBroken = true;

    scooter.fix();
    jest.runAllTimers();

    expect(scooter.isBroken).toBe(false);
  });

  it('should mark as available when fixed', () => {
    scooter.isBroken = true;
    expect(scooter.isAvailable).toBe(false);

    scooter.fix();
    jest.runAllTimers();

    expect(scooter.isAvailable).toBe(true);
  });

  it('should mark as available when charged', () => {
    scooter.batteryPercent = 0;
    expect(scooter.isAvailable).toBe(false);

    scooter.charge();
    jest.runAllTimers();

    expect(scooter.isAvailable).toBe(true);
  });

  it('should charge while docked', () => {
    scooter.batteryPercent = 1;

    jest.runAllTimers();
    expect(scooter.batteryPercent).toBe(1);

    station.dock(scooter);
    jest.runAllTimers();
    expect(scooter.batteryPercent).toBe(100);
  });

  it('should not pass 0 battery level', async () => {
    scooter.isHired = true;
    scooter.discharge();

    jest.advanceTimersByTime(5000);

    expect(scooter.batteryPercent).toBe(0);
  });

  it('should not be hired after it is docked', () => {
    station.dock(scooter);

    user.hireFrom(station);
    expect(scooter.isHired).toBe(true);
    user.dock(station);
    expect(scooter.isHired).toBe(false);
  });
});
