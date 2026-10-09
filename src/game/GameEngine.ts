import { Application, Container, Ticker } from 'pixi.js';
import { useGameStore } from '../store/useGameStore';
import { useAppStore } from '../store/useAppStore';
import { InputManager } from './InputManager';
import { Player } from './entities/Player';
import { Projectile } from './entities/Projectile';
import { Chaser } from './entities/Chaser';
import { Shooter } from './entities/Shooter';
import { Island } from './entities/Island';

type Enemy = Chaser | Shooter;

export class GameEngine {
  private app: Application;
  private gameContainer: Container;
  public isInitialized = false;

  private inputManager: InputManager;
  private player!: Player;
  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private islands: Island[] = [];
  private spawnTimer = 0;

  constructor() {
    this.app = new Application();
    this.gameContainer = new Container();
    this.inputManager = new InputManager();
  }

  public async init(parentElement: HTMLElement) {
    await this.app.init({
      resizeTo: parentElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x1a4b6b,
    });

    parentElement.appendChild(this.app.canvas);
    this.app.stage.addChild(this.gameContainer);

    const centerIsland = new Island(this.app.screen.width / 2, this.app.screen.height / 2, 80);
    this.islands.push(centerIsland);
    this.gameContainer.addChild(centerIsland.view);

    this.player = new Player(
      { width: this.app.screen.width, height: this.app.screen.height },
      (x, y, rotation, isEnemy) => this.spawnProjectile(x, y, rotation, isEnemy)
    );
    this.player.view.x = this.app.screen.width / 2;
    this.player.view.y = this.app.screen.height - 100;
    this.gameContainer.addChild(this.player.view);

    window.addEventListener('resize', this.handleResize);

    this.isInitialized = true;
    this.app.ticker.add(this.update.bind(this));
  }

  private spawnProjectile(x: number, y: number, rotation: number, isEnemy: boolean = false) {
    const proj = new Projectile(x, y, rotation, isEnemy);
    this.projectiles.push(proj);
    this.gameContainer.addChild(proj.view);
  }

  private spawnEnemy() {
    const width = this.app.screen.width;
    const height = this.app.screen.height;
    let x = 0, y = 0;

    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) { x = Math.random() * width; y = -30; }
    else if (edge === 1) { x = Math.random() * width; y = height + 30; }
    else if (edge === 2) { x = -30; y = Math.random() * height; }
    else { x = width + 30; y = Math.random() * height; }

    let enemy: Enemy;
    if (Math.random() > 0.5) {
      enemy = new Chaser(x, y);
    } else {
      enemy = new Shooter(x, y, (projX, projY, rot) => this.spawnProjectile(projX, projY, rot, true));
    }

    this.enemies.push(enemy);
    this.gameContainer.addChild(enemy.view);
  }

  private handleResize = () => {
    if (this.player) {
      (this.player as any).bounds = { width: this.app.screen.width, height: this.app.screen.height };
    }
  };

  private resolveIslandCollision(entityView: Container, entityRadius: number) {
    for (const island of this.islands) {
      const dx = entityView.x - island.view.x;
      const dy = entityView.y - island.view.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = island.radius + entityRadius;

      if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        entityView.x = island.view.x + Math.cos(angle) * minDistance;
        entityView.y = island.view.y + Math.sin(angle) * minDistance;
      }
    }
  }

  private update(ticker: Ticker) {
    if (!this.isInitialized) return;

    const gameState = useGameStore.getState();
    if (gameState.playerHealth <= 0 || gameState.timeRemaining <= 0) return;

    const delta = ticker.deltaTime;
    
    this.player.update(delta, this.inputManager);
    this.resolveIslandCollision(this.player.view, 15);

    this.spawnTimer += delta;
    if (this.spawnTimer >= 120) { // Nasce a cada ~2 segundos
      this.spawnEnemy();
      this.spawnTimer = 0;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(delta, this.player.view.x, this.player.view.y);
      this.resolveIslandCollision(enemy.view, 15);

      const distToPlayer = Math.hypot(this.player.view.x - enemy.view.x, this.player.view.y - enemy.view.y);
      if (distToPlayer < 35) {
        enemy.active = false;
        useGameStore.getState().setPlayerHealth(gameState.playerHealth - 20);
      }

      if (!enemy.active) {
        this.gameContainer.removeChild(enemy.view);
        enemy.view.destroy();
        this.enemies.splice(i, 1);
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.update(delta);

      if (proj.active) {
        for (const island of this.islands) {
          const distToIsland = Math.hypot(proj.view.x - island.view.x, proj.view.y - island.view.y);
          if (distToIsland < island.radius) {
            proj.active = false;
            break;
          }
        }
      }

      if (proj.active) {
        if (proj.isEnemy) {
          const distToPlayer = Math.hypot(proj.view.x - this.player.view.x, proj.view.y - this.player.view.y);
          if (distToPlayer < 20) {
            proj.active = false;
            useGameStore.getState().setPlayerHealth(gameState.playerHealth - 10);
          }
        } else {
          for (const enemy of this.enemies) {
            if (!enemy.active) continue;
            const dist = Math.hypot(proj.view.x - enemy.view.x, proj.view.y - enemy.view.y);
            if (dist < 20) {
              proj.active = false;
              enemy.takeDamage(10);
              if (!enemy.active) {
                useGameStore.getState().addScore(1);
              }
              break; 
            }
          }
        }
      }

      if (!proj.active) {
        this.gameContainer.removeChild(proj.view);
        proj.view.destroy();
        this.projectiles.splice(i, 1);
      }
    }
  }

  public startClock() {
    const timerInterval = setInterval(() => {
      const state = useGameStore.getState();
      
      if (state.timeRemaining > 0 && state.playerHealth > 0) {
        useGameStore.getState().setTimeRemaining(state.timeRemaining - 1);
      } else {
        clearInterval(timerInterval);
        useAppStore.getState().setScreen('result');
      }
    }, 1000);

    (this as any)._timer = timerInterval;
  }

  public destroy() {
    if ((this as any)._timer) clearInterval((this as any)._timer);
    window.removeEventListener('resize', this.handleResize);
    if (this.inputManager) this.inputManager.destroy();
    
    if (this.isInitialized && this.app) {
      try {
        if (this.app.canvas && this.app.canvas.parentNode) {
          this.app.canvas.parentNode.removeChild(this.app.canvas);
        }
        this.app.destroy(true, { children: true, texture: true });
      } catch (e) {}
    }
    this.isInitialized = false;
  }
}