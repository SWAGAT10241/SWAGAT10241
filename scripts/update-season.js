/**
 * @fileoverview Auto-Update GitHub Profile Seasonal Weather & Atmospheric Dividers
 * Automatically inspects the current date/month and updates:
 *   - assets/seasonal-weather.svg
 *   - assets/seasonal-divider.svg
 * so anyone viewing the GitHub profile gets seamless seasonal particles across the whole page.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

let activeHeaderFile = 'weather-autumn.svg';
let activeDividerFile = 'divider-autumn.svg';
let seasonName = 'Autumn Foliage (Leaf Fall)';

/**
 * 6-Season Cycle (Traditional Shada Ritu & Climatological Cycle):
 * 0, 1   (Jan, Feb): Shishira / Deep Winter Frost (Snow Fall)
 * 2, 3   (Mar, Apr): Vasanta / Spring Sakura (Petal Bloom)
 * 4, 5   (May, Jun): Grishma / Summer Solstice (Solar Fireflies)
 * 6, 7   (Jul, Aug): Varsha / Monsoon Rain (Water Drops)
 * 8, 9   (Sep, Oct): Sharad / Early Autumn (Golden Leaf Fall)
 * 10, 11 (Nov, Dec): Hemanta / Pre-Winter Frost (Frosted Amber & Aurora)
 */
if (month === 0 || month === 1) {
  activeHeaderFile = 'weather-winter.svg';
  activeDividerFile = 'divider-winter.svg';
  seasonName = 'Shishira / Deep Winter Frost (Snow Fall)';
} else if (month === 2 || month === 3) {
  activeHeaderFile = 'weather-spring.svg';
  activeDividerFile = 'divider-spring.svg';
  seasonName = 'Vasanta / Spring Sakura (Petal Bloom)';
} else if (month === 4 || month === 5) {
  activeHeaderFile = 'weather-summer.svg';
  activeDividerFile = 'divider-summer.svg';
  seasonName = 'Grishma / Summer Solstice (Solar Fireflies)';
} else if (month === 6 || month === 7) {
  activeHeaderFile = 'weather-rain.svg';
  activeDividerFile = 'divider-rain.svg';
  seasonName = 'Varsha / Monsoon Rain (Water Drops)';
} else if (month === 8 || month === 9) {
  activeHeaderFile = 'weather-autumn.svg';
  activeDividerFile = 'divider-autumn.svg';
  seasonName = 'Sharad / Early Autumn (Golden Leaf Fall)';
} else {
  // month === 10 || month === 11 (Nov, Dec)
  activeHeaderFile = 'weather-prewinter.svg';
  activeDividerFile = 'divider-prewinter.svg';
  seasonName = 'Hemanta / Pre-Winter Frost (Frosted Amber & Aurora)';
}

// 1. Sync Header
const headerSource = path.join(rootDir, 'assets', activeHeaderFile);
const headerTarget = path.join(rootDir, 'assets', 'seasonal-weather.svg');
const publicHeaderTarget = path.join(rootDir, 'public', 'seasonal-weather.svg');

if (fs.existsSync(headerSource)) {
  const content = fs.readFileSync(headerSource, 'utf-8');
  fs.writeFileSync(headerTarget, content, 'utf-8');
  if (fs.existsSync(path.join(rootDir, 'public'))) {
    fs.writeFileSync(publicHeaderTarget, content, 'utf-8');
  }
  console.log(`[Season Sync] Header: "${activeHeaderFile}" -> "seasonal-weather.svg" (${seasonName})`);
}

// 2. Sync Divider
const dividerSource = path.join(rootDir, 'assets', activeDividerFile);
const dividerTarget = path.join(rootDir, 'assets', 'seasonal-divider.svg');
const publicDividerTarget = path.join(rootDir, 'public', 'seasonal-divider.svg');

if (fs.existsSync(dividerSource)) {
  const content = fs.readFileSync(dividerSource, 'utf-8');
  fs.writeFileSync(dividerTarget, content, 'utf-8');
  if (fs.existsSync(path.join(rootDir, 'public'))) {
    fs.writeFileSync(publicDividerTarget, content, 'utf-8');
  }
  console.log(`[Season Sync] Divider: "${activeDividerFile}" -> "seasonal-divider.svg"`);
}
