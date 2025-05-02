import React, {useMemo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '@/screens/HomeScreen';
import SettingScreen from '@/screens/SettingScreen';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import '@/i18n';
import {useTranslation} from 'react-i18next';
import RootStackParamList from '@/types/navigation';

const Drawer = createDrawerNavigator<RootStackParamList>();

const MenuButton = React.memo(
  ({onPress, color}: {onPress: () => void; color: string}) => (
    <TouchableOpacity onPress={onPress} style={styles.menuButton}>
      <Icon name="menu" size={24} color={color} />
    </TouchableOpacity>
  ),
);

const MenuDrawerContent = React.memo(
  ({navigation}: DrawerContentComponentProps) => {
    const {theme} = useStore();
    const {t} = useTranslation();
    const currentTheme = useMemo(
      () => (theme === 'light' ? lightTheme : darkTheme),
      [theme],
    );

    const handleHomePress = useCallback(
      () => navigation.navigate('Home'),
      [navigation],
    );
    const handleSettingsPress = useCallback(
      () => navigation.navigate('Setting'),
      [navigation],
    );

    return (
      <View
        style={[
          styles.drawerContainer,
          {backgroundColor: currentTheme.colors.background},
        ]}>
        <View
          style={[
            styles.drawerHeader,
            {borderBottomColor: currentTheme.colors.border},
          ]}>
          <Text
            style={[
              styles.drawerHeaderText,
              {color: currentTheme.colors.text},
            ]}>
            {t('common.menu')}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.drawerItem,
            {borderBottomColor: currentTheme.colors.border},
          ]}
          onPress={handleHomePress}>
          <Icon
            name="home"
            size={24}
            color={currentTheme.colors.text}
            style={styles.drawerItemIcon}
          />
          <Text
            style={[styles.drawerItemText, {color: currentTheme.colors.text}]}>
            {t('common.home')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.drawerItem,
            {borderBottomColor: currentTheme.colors.border},
          ]}
          onPress={handleSettingsPress}>
          <Icon
            name="cog"
            size={24}
            color={currentTheme.colors.text}
            style={styles.drawerItemIcon}
          />
          <Text
            style={[styles.drawerItemText, {color: currentTheme.colors.text}]}>
            {t('common.settings')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

function App(): React.JSX.Element {
  const {theme} = useStore();
  const {t} = useTranslation();
  const currentTheme = useMemo(
    () => (theme === 'light' ? lightTheme : darkTheme),
    [theme],
  );

  const screenOptions = useCallback(
    ({
      navigation,
    }: {
      navigation: DrawerNavigationProp<RootStackParamList>;
    }): DrawerNavigationOptions => ({
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
      headerLeft: () => (
        <MenuButton
          onPress={() => navigation.openDrawer()}
          color={currentTheme.colors.text}
        />
      ),
    }),
    [currentTheme],
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <MenuDrawerContent {...props} />}
        screenOptions={screenOptions}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t('common.home'),
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            title: t('common.settings'),
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
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  drawerItemIcon: {
    marginRight: 15,
  },
  drawerItemText: {
    fontSize: 16,
  },
  menuButton: {
    marginLeft: 15,
    padding: 10,
  },
});

export default App;
