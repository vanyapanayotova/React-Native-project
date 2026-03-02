import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './screens/MainScreen';
import AuthNavigator from './navigation/AuthNavigator';
import UserProvider from './contexts/user/UserProvider';
import { UserContext } from './contexts/user/UserContext';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <UserProvider>
        <UserContext.Consumer>
          {({ isAuthenticated }) =>
            isAuthenticated
              ? <MainScreen />
              : <AuthNavigator />
          }
        </UserContext.Consumer>
      </UserProvider>

    </NavigationContainer>
  );
}
