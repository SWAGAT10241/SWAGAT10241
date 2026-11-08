/**
 * @fileoverview tsParticles Interactive Physics Layer
 * Full-featured interactive particle simulation with cursor repulsion, wind flutter,
 * and 6-season physical parameters.
 */
import React, { useMemo, useCallback } from 'react';
import { ParticlesProvider, Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useGame } from '../../hooks/useGame.js';
import { SEASONS } from '../../config/season.config.js';

export function InteractiveParticles() {
  const { activeSeason } = useGame();

  const initParticles = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => {
    const baseInteractivity = {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
        resize: {
          enable: true,
          delay: 0.5,
        },
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4,
          speed: 1,
        },
        push: {
          quantity: 4,
        },
      },
    };

    switch (activeSeason) {
      case SEASONS.WINTER:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: baseInteractivity,
          particles: {
            number: { value: 65, density: { enable: true, width: 900, height: 900 } },
            color: { value: ['#ffffff', '#e0f2fe', '#38bdf8', '#bae6fd'] },
            shape: { type: ['circle', 'star'] },
            opacity: { value: { min: 0.4, max: 0.9 } },
            size: { value: { min: 2, max: 5 } },
            move: {
              enable: true,
              speed: { min: 1, max: 2.4 },
              direction: 'bottom',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            wobble: {
              enable: true,
              distance: 12,
              speed: { min: 5, max: 12 },
            },
          },
        };

      case SEASONS.PREWINTER:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: baseInteractivity,
          particles: {
            number: { value: 50, density: { enable: true, width: 900, height: 900 } },
            color: { value: ['#f59e0b', '#fbbf24', '#ea580c', '#38bdf8', '#00f0ff'] },
            shape: { type: ['circle', 'star'] },
            opacity: { value: { min: 0.5, max: 0.95 } },
            size: { value: { min: 3, max: 7 } },
            rotate: {
              value: { min: 0, max: 360 },
              animation: { enable: true, speed: 6 },
            },
            move: {
              enable: true,
              speed: { min: 1.2, max: 2.8 },
              direction: 'bottom-right',
              random: true,
              outModes: { default: 'out' },
            },
            wobble: {
              enable: true,
              distance: 18,
              speed: { min: 6, max: 15 },
            },
          },
        };

      case SEASONS.AUTUMN:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: baseInteractivity,
          particles: {
            number: { value: 45, density: { enable: true, width: 900, height: 900 } },
            color: { value: ['#ff5722', '#ff9800', '#ffb300', '#d84315', '#ef6c00'] },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.6, max: 0.95 } },
            size: { value: { min: 4, max: 9 } },
            rotate: {
              value: { min: 0, max: 360 },
              animation: { enable: true, speed: 8 },
            },
            move: {
              enable: true,
              speed: { min: 1.5, max: 3.2 },
              direction: 'bottom-right',
              random: true,
              outModes: { default: 'out' },
            },
            wobble: {
              enable: true,
              distance: 22,
              speed: { min: 8, max: 18 },
            },
          },
        };

      case SEASONS.RAIN:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: baseInteractivity,
          particles: {
            number: { value: 85, density: { enable: true, width: 900, height: 900 } },
            color: { value: ['#00f0ff', '#38bdf8', '#0284c7'] },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.4, max: 0.85 } },
            size: { value: { min: 1.5, max: 3 } },
            move: {
              enable: true,
              speed: { min: 12, max: 18 },
              direction: 'bottom',
              straight: true,
              outModes: { default: 'out' },
            },
          },
        };

      case SEASONS.SPRING:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: baseInteractivity,
          particles: {
            number: { value: 45, density: { enable: true, width: 900, height: 900 } },
            color: { value: ['#ff70a6', '#ffb3c6', '#ff4d6d', '#f72585'] },
            shape: { type: 'circle' },
            opacity: { value: { min: 0.5, max: 0.9 } },
            size: { value: { min: 3, max: 7 } },
            rotate: {
              value: { min: 0, max: 360 },
              animation: { enable: true, speed: 7 },
            },
            move: {
              enable: true,
              speed: { min: 1.2, max: 2.6 },
              direction: 'bottom-right',
              random: true,
              outModes: { default: 'out' },
            },
            wobble: {
              enable: true,
              distance: 16,
              speed: { min: 7, max: 14 },
            },
          },
        };

      case SEASONS.SUMMER:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: baseInteractivity,
          particles: {
            number: { value: 38, density: { enable: true, width: 900, height: 900 } },
            color: { value: ['#facc15', '#fef08a', '#fbbf24', '#00f0ff'] },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.3, max: 0.95 },
              animation: { enable: true, speed: 1.5, sync: false },
            },
            size: { value: { min: 2.5, max: 6 } },
            move: {
              enable: true,
              speed: { min: 0.8, max: 1.8 },
              direction: 'top',
              random: true,
              outModes: { default: 'out' },
            },
          },
        };

      case SEASONS.WAVES:
      default:
        return {
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 0 },
          },
        };
    }
  }, [activeSeason]);

  return (
    <div className="tsparticles-wrapper" aria-hidden="true">
      <ParticlesProvider init={initParticles}>
        <Particles id="tsparticles-bg" options={options} />
      </ParticlesProvider>
    </div>
  );
}