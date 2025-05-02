import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen';
import useStore from './src/store/useStore';
import {lightTheme, darkTheme} from './src/types/theme';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const {theme} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
          },
          headerTintColor: currentTheme.colors.text,
          headerTitleStyle: {
            color: currentTheme.colors.text,
          },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
