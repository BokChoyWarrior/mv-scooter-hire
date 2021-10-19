export class Location {
  x;
  y;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Location) {
    return Math.sqrt(Math.pow(this.x - other.x, 2 + Math.pow(this.y - other.y, 2)));
  }
}
