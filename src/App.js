import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './navigation/AuthNavigator';
import ItemsListScreen from './screens/ItemsListScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import ItemFormScreen from './screens/ItemFormScreen';
import ProfileScreen from './screens/ProfileScreen';

import UserProvider from './contexts/user/UserProvider';
import { UserContext } from './contexts/user/UserContext';

// stack used inside tabs
function MarketplaceStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Items" component={ItemsListScreen} />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={({ route }) => ({ title: route.params?.title || 'Detail' })}
      />
      <Stack.Screen
        name="ItemForm"
        component={ItemFormScreen}
        options={({ route }) => ({ title: route.params?.item ? 'Edit Item' : 'New Item' })}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      {/* top-level tab is called "Profile", inner screen renamed to avoid name collision */}
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <UserProvider>
        <UserContext.Consumer>
          {({ isAuthenticated }) =>
            isAuthenticated ? (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  headerShown: false,
                  tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Marketplace') {
                      iconName = 'home-outline';
                    } else if (route.name === 'Profile') {
                      iconName = 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#007AFF',
                  tabBarInactiveTintColor: 'gray',
                })}
              >
                <Tab.Screen name="Marketplace" component={MarketplaceStack} />
                <Tab.Screen name="Profile" component={ProfileStack} />
              </Tab.Navigator>
            ) : (
              <AuthNavigator />
            )
          }
        </UserContext.Consumer>
      </UserProvider>
    </NavigationContainer>
  );
}
