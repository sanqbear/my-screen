import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerParamList} from './navigation';
import HomeStackNavigator from './home/HomeStackNavigator';
import SettingsStackNavigator from './settings/SettingsStackNavigator';
import {darkTheme, lightTheme, Theme} from '@/types';
import {useMemo} from 'react';
import useAppStore from '@/store/appStore';
import {useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from '@react-native-vector-icons/ionicons';
import RecentlyAddedStackNavigator from './recentlyAdded/RecentlyAddedStackNavigator';

const Drawer = createDrawerNavigator<DrawerParamList>();
const HomeIcon = ({focused}: {focused: boolean}, theme: Theme) => {
  return (
    <Icon
      name="home"
      size={24}
      color={focused ? theme.textPrimary : theme.text}
    />
  );
};
const RecentlyAddedIcon = ({focused}: {focused: boolean}, theme: Theme) => {
  return (
    <Icon
      name="time"
      size={24}
      color={focused ? theme.textPrimary : theme.text}
    />
  );
};
const SettingsIcon = ({focused}: {focused: boolean}, theme: Theme) => {
  return (
    <Icon
      name="settings"
      size={24}
      color={focused ? theme.textPrimary : theme.text}
    />
  );
};

function DrawerNavigator() {
  const {theme} = useAppStore();
  const {t} = useTranslation();
  const colorScheme = useColorScheme();
  const currentTheme = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark')
      ? darkTheme
      : lightTheme;
  }, [theme, colorScheme]);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          paddingTop: 50,
          backgroundColor: currentTheme.card,
        },
        drawerActiveBackgroundColor: currentTheme.primary,
        drawerActiveTintColor: currentTheme.textPrimary,
        drawerInactiveTintColor: currentTheme.text,
      }}>
      <Drawer.Screen
        name="Home"
        options={{
          title: t('home.title'),
          drawerIcon: ({focused}) => HomeIcon({focused}, currentTheme),
        }}
        component={HomeStackNavigator}
      />
      <Drawer.Screen
        name="RecentlyAdded"
        options={{
          title: t('recentlyAdded.title'),
          drawerIcon: ({focused}) => RecentlyAddedIcon({focused}, currentTheme),
        }}
        component={RecentlyAddedStackNavigator}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          title: t('settings.title'),
          drawerIcon: ({focused}) => SettingsIcon({focused}, currentTheme),
        }}
        component={SettingsStackNavigator}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
