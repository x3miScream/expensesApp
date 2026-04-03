import Constants from 'expo-constants';

/**
 * Centered configuration for the application.
 * Using a central object allows for easy debugging and validation.
 */
const Config = {
  // Use the env variable or fallback to a local IP for physical device testing
  serverApiUrl: process.env.EXPO_PUBLIC_EXPENSE_TRACK_APP_SERVER_HOST_URL || 'undefined',
  
  env: process.env.EXPO_PUBLIC_ENV || 'dev',
  
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'dev',
};

// Simple validation to warn the team if they forgot their .env
if (!Config.apiUrl && !Config.isDevelopment) {
  console.error("CRITICAL: API_URL is not defined in the environment!");
}

export default Config;