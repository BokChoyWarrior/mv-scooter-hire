import { Scooter } from './Scooter';
// jest.useFakeTimers('modern');
jest.setTimeout(10000);
// Example environment for testing purposes
function setupMockEnvironment(): { scooters: Scooter[]; users: string[] } {
  const mockValues = {
    scooters: [new Scooter()],
    users: ['123'],
  };

  return mockValues;
}

describe('the AppUser class', () => {
  let scooters: Scooter[], users: string[];

  beforeEach(() => {
    return ({ scooters, users } = setupMockEnvironment());
  });

  test('instantiation', () => {
    expect(scooters[0].id).toBe(0);
    const newScooter = new Scooter();
    expect(newScooter.id).toBe(1);
    expect(scooters[0].isHired).toBe(false);
  });

  test('the user can register', () => {});
});

describe('the Scooter class', () => {
  let scooters: Scooter[], users: string[];

  beforeEach(() => {
    return ({ scooters, users } = setupMockEnvironment());
  });

  it('should charge properly', () => {
    const scooter = new Scooter();
    expect(scooter.batteryLevel).toBe(100);

    scooter.batteryLevel = 1;
    expect(scooter.batteryLevel).toBe(1);
    expect(scooter.isAvailable).toBe(false);

    const promiseA = scooter.charge();
    const promiseB = scooter.charge();
    expect(promiseA).toBe(promiseB); // We use toBe() to check reference, not value

    // WORKS
    return promiseA
      .then(() => {
        expect(scooter.batteryLevel).toBe(100);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();

    // Also works :)
    // await scooter.charge();
    // expect(scooter.batteryLevel).toBe(100);
    // expect(scooter.isAvailable).toBe(true);
  });

  // This is essentially the same test as above, but for fixing rather than charging
  it('should be fix properly', () => {
    const scooter = new Scooter();
    expect(scooter.isBroken).toBe(false);

    scooter.isBroken = true;
    expect(scooter.isBroken).toBe(true);
    expect(scooter.isAvailable).toBe(false);

    // Let's test the promise feature
    scooter.isBroken = true;
    const promiseA = scooter.fix();
    const promiseB = scooter.fix();
    expect(promiseA).toBe(promiseB);

    return promiseA
      .then(() => {
        expect(scooter.isBroken).toBe(false);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();
  });

  it('should set itself available when charged and fixed', () => {});
});

describe('the ChargingStation class', () => {});
