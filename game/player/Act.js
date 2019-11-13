export class Act {
  constructor(cd, action) {
    this.cooldown = cd;
    this.cd = 0;
    this.action = action;
  }

  use(target) {
    if (this.cd == 0) {
      this.cd = this.cooldown;
      this.action(target);
    }
  }
}
