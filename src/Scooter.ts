import { EventEmitter } from 'node:events';
export class Scooter extends EventEmitter {
  // Extend eventEmitter so that DockingStation can listen to events rather than loop through scooters
  // Static
  static all: Scooter[] = [];
  static allAvailable: Scooter[] = [];

  // Public
  public id: number = Scooter.all.length;
  public isHired: boolean = false;
  public isAvailable: boolean = true;

  // Private
  private _batteryLevel: number = 100;
  private _isBroken: boolean = false;
  private _isBeingFixed: boolean = false;
  private _isCharging: boolean = false;
  // Note: Here we create two fulfilled promises so that we can track the active fixes or charge task
  // When a scooter begins charging, we update this value so that if charge() or fix() are called again,
  // we can see there is an active promise and return that to the callee in order to be notified when
  // the scooter is fixed/charged
  private _chargingPromise: Promise<void> = new Promise(res => res());
  private _fixingPromise: Promise<void> = new Promise(res => res());

  // Constructor
  constructor() {
    super();
    Scooter.all.push(this);
  }

  // Getters + setters
  get isBroken(): boolean {
    return this._isBroken;
  }

  set isBroken(broken: boolean) {
    this._isBroken = broken;
    if (!broken) {
      this._isBeingFixed = false;
    }
    this.updateAvailability();
  }

  get batteryLevel(): number {
    return this._batteryLevel;
  }

  set batteryLevel(level: number) {
    this._batteryLevel = level;
    if (level === 100) {
      this._isCharging = false;
    }
    this.updateAvailability();
  }

  // Methods
  updateAvailability() {
    if (this.isBroken || this.batteryLevel !== 100) {
      this.isAvailable = false;
      this.emit('unavailable');
    } else {
      this.isAvailable = true;
      this.emit('available');
    }
  }

  // Again, if the scooter is charging, there should be an unfulfilled promise in this._isCharging
  // so we can siply return that. Otherwise, we create a new promise and set this._isCharging to it,
  // and then return to the callee
  charge(): Promise<void> {
    if (!this._isCharging) {
      this._isCharging = true;

      this._chargingPromise = new Promise(resolve => {
        setTimeout(() => {
          this.batteryLevel = 100;
          resolve();
        }, (100 - this.batteryLevel) * 20);
      });
    }
    return this._chargingPromise;
  }

  // Same thing here, but for fixing
  fix(): Promise<void> {
    if (!this._isBeingFixed) {
      this._isBeingFixed = true;

      this._fixingPromise = new Promise(resolve => {
        setTimeout(() => {
          this.isBroken = false;
          resolve();
        }, Math.random() * 5000);
      });
    }
    return this._fixingPromise;
  }
  // async fix() {
  //   this._isBeingFixed = true;
  //   await new Promise(res => setTimeout(res, Math.random() * 5000));
  //   this.isBroken = false;
  // }
}
