import { Container, Graphics } from 'pixi.js';
import { InputManager } from '../InputManager';

export class Player {
  public view: Container;
  private bounds: { width: number, height: number };
  private onFire: (x: number, y: number, rotation: number, isEnemy?: boolean) => void;
  private speed = 4;
  private rotationSpeed = 0.05;
  private frontCooldown = 0;
  private sideCooldown = 0; // Trazendo o cooldown lateral de volta!

  constructor(bounds: { width: number, height: number }, onFire: (x: number, y: number, rot: number, isEnemy?: boolean) => void) {
    this.view = new Container();
    this.bounds = bounds; 
    this.onFire = onFire;
    
    const shipGraphic = new Graphics();
    shipGraphic.moveTo(20, 0).lineTo(-15, -15).lineTo(-10, 0).lineTo(-15, 15).lineTo(20, 0).fill({ color: 0x00FF00 });
    this.view.addChild(shipGraphic);
    
    this.view.x = bounds.width / 2;
    this.view.y = bounds.height / 2;
    this.view.rotation = -Math.PI / 2;
  }

  public update(delta: number, input: InputManager) {
    if (input.isKeyDown(['KeyA', 'ArrowLeft'])) this.view.rotation -= this.rotationSpeed * delta;
    if (input.isKeyDown(['KeyD', 'ArrowRight'])) this.view.rotation += this.rotationSpeed * delta;
    if (input.isKeyDown(['KeyW', 'ArrowUp'])) {
      this.view.x += Math.cos(this.view.rotation) * this.speed * delta;
      this.view.y += Math.sin(this.view.rotation) * this.speed * delta;
    }
    
    const padding = 20;
    if (this.view.x < padding) this.view.x = padding;
    if (this.view.x > this.bounds.width - padding) this.view.x = this.bounds.width - padding;
    if (this.view.y < padding) this.view.y = padding;
    if (this.view.y > this.bounds.height - padding) this.view.y = this.bounds.height - padding;
    
    this.handleShooting(input, delta);
  }

  private handleShooting(input: InputManager, delta: number) {
    // Reduz o tempo de recarga a cada frame
    if (this.frontCooldown > 0) this.frontCooldown -= delta;
    if (this.sideCooldown > 0) this.sideCooldown -= delta;

    // Tiro Frontal (Espaço)
    if (input.isKeyDown('Space') && this.frontCooldown <= 0) {
      this.onFire(this.view.x, this.view.y, this.view.rotation, false);
      this.frontCooldown = 15;
    }

    // Tiro Lateral Esquerdo (Tecla Q)
    if (input.isKeyDown('KeyQ') && this.sideCooldown <= 0) {
      this.fireSideBroadside(-Math.PI / 2);
      this.sideCooldown = 45; // Cooldown maior para os tiros laterais
    }

    // Tiro Lateral Direito (Tecla E)
    if (input.isKeyDown('KeyE') && this.sideCooldown <= 0) {
      this.fireSideBroadside(Math.PI / 2);
      this.sideCooldown = 45;
    }
  }

  // Função que dispara 3 projéteis de uma vez pela lateral
  private fireSideBroadside(angleOffset: number) {
    const shotAngle = this.view.rotation + angleOffset;
    const offsets = [-15, 0, 15]; // Posições das 3 "bocas" do canhão na lateral do navio
    
    offsets.forEach(offset => {
      const spawnX = this.view.x + Math.cos(this.view.rotation) * offset;
      const spawnY = this.view.y + Math.sin(this.view.rotation) * offset;
      this.onFire(spawnX, spawnY, shotAngle, false);
    });
  }
}