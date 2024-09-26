import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'inactivity-storage',
});

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);

  const router = useRouter();

  const { isSignedIn } = useAuth();

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      recordStartTime();
    } else if (
      nextAppState === 'active' &&
      appState.current.match(/background/)
    ) {
      console.log('WE ARE BACK: ', storage.getNumber('startTime') || 0);

      const elapsed = Date.now() - (storage.getNumber('startTime') || 0);

      if (elapsed > 3000 && isSignedIn) {
        // console.log('TIME ELAPSED: ', elapsed);
        router.replace('/(authenticated)/(modals)/lock');
      }
    }
    // console.log({ nextAppState });
    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    // console.log('RECORDING START TIME');
    storage.set('startTime', Date.now());
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return children;
};
