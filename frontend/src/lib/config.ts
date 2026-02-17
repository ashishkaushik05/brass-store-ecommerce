/**
 * Environment Configuration
 * Validates and exports all environment variables with type safety
 * Following 12-factor app principles
 */

interface Config {
  // Clerk Authentication
  clerkPublishableKey: string;
  
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Validate required environment variables
const validateEnv = (): Config => {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Required variables
  if (!clerkPublishableKey) {
    throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required but not defined in environment');
  }

  if (!apiBaseUrl && import.meta.env.PROD) {
    throw new Error('VITE_API_BASE_URL is required in production');
  }

  const mode = import.meta.env.MODE || 'development';

  return {
    // Clerk
    clerkPublishableKey,
    
    // API
    apiBaseUrl: apiBaseUrl || 'http://localhost:3001',
    apiTimeout: 15000, // 15 seconds
    
    // Environment
    isDevelopment: mode === 'development',
    isProduction: mode === 'production',
    isTest: mode === 'test',
  };
};

// Export validated config
export const config = validateEnv();

// Export for type safety
export type AppConfig = typeof config;

// Log configuration in development (excluding sensitive data)
if (config.isDevelopment) {
  console.log('[Config] Environment:', {
    mode: import.meta.env.MODE,
    apiBaseUrl: config.apiBaseUrl,
    hasClerkKey: !!config.clerkPublishableKey,
  });
}
