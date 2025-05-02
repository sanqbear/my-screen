import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen';
import useStore from './src/store/useStore';
import {lightTheme, darkTheme} from './src/types/theme';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function MenuDrawerContent({navigation}: DrawerContentComponentProps) {
  const {theme, language} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View
      style={[
        styles.drawerContainer,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <View style={styles.drawerHeader}>
        <Text
          style={[styles.drawerHeaderText, {color: currentTheme.colors.text}]}>
          {language === 'ko' ? '메뉴' : 'Menu'}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.drawerItem,
          {backgroundColor: currentTheme.colors.primary},
        ]}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.drawerItemText}>
          {language === 'ko' ? '홈' : 'Home'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.drawerItem,
          {backgroundColor: currentTheme.colors.primary},
        ]}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.drawerItemText}>
          {language === 'ko' ? '설정' : 'Settings'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function App(): React.JSX.Element {
  const {theme} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={MenuDrawerContent}
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
          },
          headerTintColor: currentTheme.colors.text,
          headerTitleStyle: {
            color: currentTheme.colors.text,
          },
          drawerStyle: {
            backgroundColor: currentTheme.colors.background,
          },
        }}>
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerItem: {
    padding: 15,
    margin: 5,
    borderRadius: 5,
  },
  drawerItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default App;
