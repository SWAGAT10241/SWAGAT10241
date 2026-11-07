/**
 * @fileoverview Auto-Update GitHub Profile Seasonal Weather Banner
 * Automatically inspects the current date/month and updates assets/seasonal-weather.svg
 * so anyone opening the GitHub profile gets the matching live seasonal animation.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

let activeSeasonFile = 'weather-autumn.svg';
let seasonName = 'Autumn Foliage (Leaf Fall)';

if (month === 11 || month === 0 || month === 1) {
  activeSeasonFile = 'weather-winter.svg';
  seasonName = 'Winter Frost (Snow Fall)';
} else if (month >= 2 && month <= 4) {
  activeSeasonFile = 'weather-spring.svg';
  seasonName = 'Spring Sakura (Petal Fall)';
} else if (month >= 5 && month <= 7) {
  activeSeasonFile = 'weather-rain.svg';
  seasonName = 'Neon Rainfall (Water Drops)';
} else {
  activeSeasonFile = 'weather-autumn.svg';
  seasonName = 'Autumn Foliage (Leaf Fall)';
}

const sourcePath = path.join(rootDir, 'assets', activeSeasonFile);
const targetPath = path.join(rootDir, 'assets', 'seasonal-weather.svg');
const publicTargetPath = path.join(rootDir, 'public', 'seasonal-weather.svg');

if (fs.existsSync(sourcePath)) {
  const content = fs.readFileSync(sourcePath, 'utf-8');
  fs.writeFileSync(targetPath, content, 'utf-8');
  if (fs.existsSync(path.join(rootDir, 'public'))) {
    fs.writeFileSync(publicTargetPath, content, 'utf-8');
  }
  console.log(`[Season Sync] Successfully synced "${activeSeasonFile}" -> "seasonal-weather.svg" (${seasonName})`);
} else {
  console.error(`[Season Sync] Source file ${sourcePath} not found`);
}
