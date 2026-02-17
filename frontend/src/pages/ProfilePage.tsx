import React from 'react';
import { useUser } from '@clerk/clerk-react';

const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-text-subtle">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-serif mb-4">Profile</h1>
        <p className="text-text-subtle">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-serif mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-6 mb-8">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.fullName || 'Profile'}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-medium text-text-main">{user.fullName}</h2>
            <p className="text-text-subtle">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-subtle mb-1">Email</label>
            <p className="text-text-main">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-subtle mb-1">Member Since</label>
            <p className="text-text-main">{new Date(user.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
