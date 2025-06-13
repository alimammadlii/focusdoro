import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has an active subscription
    const checkSubscription = async () => {
      try {
        // TODO: Implement actual subscription check with backend
        // For now, we'll just simulate a basic subscription
        setSubscription({
          hasSubscription: false,
          plan: null,
          expiresAt: null,
        });
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const upgradeSubscription = async (planId) => {
    try {
      // TODO: Implement actual subscription upgrade with backend
      // For now, we'll just simulate a successful upgrade
      setSubscription({
        hasSubscription: true,
        plan: {
          id: planId,
          name: 'Premium',
          features: ['Unlimited Tasks', 'Advanced Statistics', 'Custom Themes'],
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      return false;
    }
  };

  const cancelSubscription = async () => {
    try {
      // TODO: Implement actual subscription cancellation with backend
      // For now, we'll just simulate a successful cancellation
      setSubscription({
        hasSubscription: false,
        plan: null,
        expiresAt: null,
      });
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  };

  const value = {
    subscription,
    loading,
    upgradeSubscription,
    cancelSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext; 