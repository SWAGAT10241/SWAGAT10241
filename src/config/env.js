/**
 * @fileoverview Environment Configuration Module
 * Parses, validates, and provides type-safe access to Vite environment variables.
 */

const getEnvBool = (key, defaultValue = false) => {
  const val = import.meta.env[key];
  if (val === undefined || val === '') return defaultValue;
  return String(val).toLowerCase() === 'true';
};

const getEnvNumber = (key, defaultValue = 0) => {
  const val = import.meta.env[key];
  if (val === undefined || val === '') return defaultValue;
  const num = Number(val);
  return Number.isNaN(num) ? defaultValue : num;
};

const getEnvString = (key, defaultValue = '') => {
  const val = import.meta.env[key];
  return (val !== undefined && val !== '') ? String(val) : defaultValue;
};

export const ENV = Object.freeze({
  APP_TITLE: getEnvString('VITE_APP_TITLE', 'CYBER-PULSE: VOID BREAKER'),
  APP_VERSION: getEnvString('VITE_APP_VERSION', '1.0.0'),
  BUILD_ENV: getEnvString('VITE_APP_BUILD_ENV', 'production'),
  BASE_URL: import.meta.env.BASE_URL || '/',
  
  // Feature Toggles
  ENABLE_SOUND: getEnvBool('VITE_ENABLE_SOUND', true),
  ENABLE_HAPTICS: getEnvBool('VITE_ENABLE_HAPTICS', true),
  ENABLE_MOCK_API: getEnvBool('VITE_ENABLE_MOCK_API', true),
  DEBUG_MODE: getEnvBool('VITE_DEBUG_MODE', false),
  
  // API Configuration
  API_BASE_URL: getEnvString('VITE_API_BASE_URL', 'https://api.swagat10241.dev/v1'),
  API_TIMEOUT_MS: getEnvNumber('VITE_API_TIMEOUT_MS', 8000),
  
  // Runtime flags
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
});

