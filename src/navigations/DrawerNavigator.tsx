import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerParamList} from './navigation';
import HomeStackNavigator from './home/HomeStackNavigator';
import SettingsStackNavigator from './settings/SettingsStackNavigator';
import {darkTheme, lightTheme} from '@/types';
import {useMemo} from 'react';
import useAppStore from '@/store/appStore';
import {useColorScheme} from 'react-native';

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  const {theme} = useAppStore();
  const colorScheme = useColorScheme();
  const isDark = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark');
  }, [theme, colorScheme]);
  const backgroundColor = useMemo(() => {
    return isDark ? darkTheme.card : lightTheme.card;
  }, [isDark]);
  const textColor = useMemo(() => {
    return isDark ? darkTheme.text : lightTheme.text;
  }, [isDark]);
  const textPrimaryColor = useMemo(() => {
    return isDark ? darkTheme.textPrimary : lightTheme.textPrimary;
  }, [isDark]);
  const primaryColor = useMemo(() => {
    return isDark ? darkTheme.primary : lightTheme.primary;
  }, [isDark]);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          paddingTop: 50,
          backgroundColor,
        },
        drawerActiveBackgroundColor: primaryColor,
        drawerActiveTintColor: textPrimaryColor,
        drawerInactiveTintColor: textColor,
      }}>
      <Drawer.Screen name="Home" component={HomeStackNavigator} />
      <Drawer.Screen name="Settings" component={SettingsStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
