import Location from '../src/Location';
import User from '../src/User';
import DockingStation from '../src/DockingStation';
import Scooter from '../src/Scooter';
import App from '../src/App';
import Person from '../src/Person';

function teardownMockEnvironment() {
  Scooter.removeAll();
  User.removeAll();
  DockingStation.removeAll();
}

let app: App = new App();
let user: User = new User('Test User', 20, app);
let station: DockingStation = new DockingStation();
let scooter: Scooter = new Scooter();

describe('the User (and Person) class', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    app = new App();
    user = new User('Test User', 20, app);
    station = new DockingStation();
    scooter = new Scooter();
  });

  afterEach(() => {
    teardownMockEnvironment();
    jest.useRealTimers();
  });

  it('the user can register', () => {
    const person = new Person('harv', 55, new Location());
    const registeredPerson = person.register(app);
    expect(registeredPerson).toBeInstanceOf(User);
  });

  it('underage users cannot register', () => {
    const underage = new Person('person 2', 5);
    expect(() => underage.register(app)).toThrowError();
  });

  it('the user can hire/dock a scooter', () => {
    station.dock(scooter);
    scooter = user.hireFrom(station);
    user.dock(station);
    expect(Object.keys(station.scooters).length).toBe(1);
  });

  it("money will be taken form user's account after docking", async () => {
    station.dock(scooter);
    const prevBalance = user.balance;

    user.hireFrom(station);
    jest.advanceTimersByTime(1000);
    user.dock(station);

    expect(user.balance).toBeLessThan(prevBalance);
  });

  it('the user cannot hire if they have no balance', () => {
    const brokeUser = new User('brok brok', 99, app);
    brokeUser.balance = 0;
    station.dock(scooter);

    expect(() => brokeUser.hireFrom(station)).toThrow();
  });

  it('the user can mark a scooter as broken, (and can contact team to get a refund NYI)', () => {
    station.dock(scooter);
    user.hireFrom(station);
    user.dock(station, true);
    const nearest = user.findNearestAvailableScooter();
    expect(nearest).toBe(false);
  });

  it("the user cannot dock a scooter if they don't have one", () => {
    expect(() => user.dock(station, false)).toThrowError();
  });

  it('the user cannot hire from a station with no scooters', () => {
    expect(() => user.hireFrom(station)).toThrowError();
  });
});
