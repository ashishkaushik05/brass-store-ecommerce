/**
 * Auth Hook
 * Wrapper around Clerk authentication
 */

import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import type { User } from '@/types/user';

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, getToken } = useClerkAuth();

  return {
    user: user as unknown as User | null,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn,
    signOut,
    getToken,
  };
};
