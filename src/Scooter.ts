import { EventEmitter } from 'node:events';

import { Location } from './Location';

export class Scooter {
  // Extend eventEmitter so that DockingStation can listen to events rather than loop through scooters
  // Static
  static all: Scooter[] = [];
  static allAvailable: Scooter[] = [];

  static removeAll() {
    Scooter.all = [];
  }

  // Public
  public id = Scooter.all.length;
  public location = new Location();

  // Private
  private _batteryLevel = 100;
  private _isBroken = false;
  private _isBeingFixed = false;
  private _isCharging = false;
  private _isHired = false;
  public _isAvailable = true;

  private _emitter = new EventEmitter();
  // Note: Here we create two fulfilled promises so that we can track the active fixes or charge task
  // When a scooter begins charging, we update this value so that if charge() or fix() are called again,
  // we can see there is an active promise and return that to the callee in order to be notified when
  // the scooter is fixed/charged
  private _chargingPromise: Promise<void> = new Promise(res => res());
  private _fixingPromise: Promise<void> = new Promise(res => res());

  // Constructor
  constructor() {
    Scooter.all.push(this);
  }

  // Proxies for emitter
  emit(event: string) {
    this._emitter.emit(event);
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void) {
    this._emitter.on(eventName, listener);
  }

  once(eventName: string | symbol, listener: (...args: any[]) => void) {
    this._emitter.on(eventName, listener);
  }

  // Getters + setters
  get isBroken() {
    return this._isBroken;
  }

  set isBroken(broken) {
    this._isBroken = broken;
    if (!broken) {
      this._isBeingFixed = false;
    }
    this.updateAvailability();
  }

  get batteryLevel() {
    return this._batteryLevel;
  }

  set batteryLevel(level) {
    this._batteryLevel = level;
    if (level === 100) {
      this._isCharging = false;
    }
    this.updateAvailability();
  }

  get isHired() {
    return this._isHired;
  }

  set isHired(hired) {
    this._isHired = hired;
    this.updateAvailability();
  }

  get isAvailable() {
    return this._isAvailable;
  }

  set isAvailable(available) {
    this._isAvailable = available;
    available ? this.emit('available') : this.emit('unavailable');
  }

  // Methods
  updateAvailability() {
    if (this.isHired || this.isBroken || this.batteryLevel !== 100) {
      this.isAvailable = false;
    } else {
      this.isAvailable = true;
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
