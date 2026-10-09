import { Container, Graphics } from 'pixi.js';
export class Shooter {
  public view: Container; public active: boolean = true; public health: number = 20; private speed = 1.5;
  private attackRange = 250; private fireCooldown = 0;
  private onFire: (x: number, y: number, rotation: number) => void;
  constructor(x: number, y: number, onFire: (x: number, y: number, rot: number) => void) {
    this.view = new Container(); this.view.x = x; this.view.y = y; this.onFire = onFire;
    const g = new Graphics(); g.poly([20, 0, 0, -15, -20, 0, 0, 15]).fill(0xFFA500); this.view.addChild(g);
  }
  public update(delta: number, playerX: number, playerY: number) {
    const dist = Math.hypot(playerX - this.view.x, playerY - this.view.y);
    this.view.rotation = Math.atan2(playerY - this.view.y, playerX - this.view.x);
    if (dist > this.attackRange) {
      this.view.x += Math.cos(this.view.rotation) * this.speed * delta;
      this.view.y += Math.sin(this.view.rotation) * this.speed * delta;
    } else {
      if (this.fireCooldown > 0) this.fireCooldown -= delta;
      if (this.fireCooldown <= 0) {
        this.onFire(this.view.x, this.view.y, this.view.rotation);
        this.fireCooldown = 90;
      }
    }
  }
  public takeDamage(amount: number) { this.health -= amount; if (this.health <= 0) this.active = false; }
}