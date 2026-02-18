export const config = {
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
};
