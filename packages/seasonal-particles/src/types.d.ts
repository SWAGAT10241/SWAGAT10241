/**
 * TypeScript Type Definitions for @swagat10241/seasonal-particles
 */

export type SeasonType =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'rain'
  | 'autumn'
  | 'prewinter'
  | 'waves';

export interface ParticleEngineOptions {
  /** Initial season preset (default: 'winter') */
  season?: SeasonType;
  /** Cursor interaction radius in pixels (default: 120) */
  cursorRadius?: number;
  /** Cursor repulsion force strength (default: 4.5) */
  cursorStrength?: number;
  /** Whether mouse hover repulsion is enabled (default: true) */
  enableCursorRepulsion?: boolean;
  /** Whether click shockwave scattering is enabled (default: true) */
  enableClickShockwave?: boolean;
}

export declare const SEASONS: {
  readonly AUTO: 'auto';
  readonly WINTER: 'winter';
  readonly SPRING: 'spring';
  readonly SUMMER: 'summer';
  readonly RAIN: 'rain';
  readonly AUTUMN: 'autumn';
  readonly PREWINTER: 'prewinter';
  readonly WAVES: 'waves';
};

export declare class SeasonalParticles {
  constructor(canvasWidth: number, canvasHeight: number, options?: SeasonType | ParticleEngineOptions);

  /** Active season key */
  season: SeasonType;
  width: number;
  height: number;

  /** Set new season and smoothly re-pool particles */
  setSeason(season: SeasonType): void;

  /** Resize simulation bounds */
  resize(width: number, height: number): void;

  /** Feed mouse coordinates for real-time repulsion */
  onMouseMove(x: number, y: number): void;

  /** Notify engine when mouse leaves canvas/window */
  onPointerLeave(): void;

  /** Trigger localized shockwave burst at coordinates */
  onClick(x: number, y: number): void;

  /** Advance physics simulation by 1 frame */
  update(): void;

  /** Render all particles to Canvas 2D context */
  draw(ctx: CanvasRenderingContext2D): void;
}

export declare function createSeasonalParticles(
  canvasWidth: number,
  canvasHeight: number,
  options?: SeasonType | ParticleEngineOptions
): SeasonalParticles;
