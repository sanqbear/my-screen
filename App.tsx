import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import HomeScreen from '@/screens/HomeScreen';
import SettingScreen from '@/screens/SettingScreen';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import '@/i18n';
import {useTranslation} from 'react-i18next';

const Drawer = createDrawerNavigator();

function MenuDrawerContent({navigation}: DrawerContentComponentProps) {
  const {theme} = useStore();
  const {t} = useTranslation();
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
          {t('common.menu')}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.drawerItem,
          {backgroundColor: currentTheme.colors.primary},
        ]}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.drawerItemText}>{t('common.home')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.drawerItem,
          {backgroundColor: currentTheme.colors.primary},
        ]}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.drawerItemText}>{t('common.settings')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const MenuButton = ({onPress, color}: {onPress: () => void; color: string}) => (
  <TouchableOpacity onPress={onPress} style={styles.menuButton}>
    <Text style={[styles.menuButtonText, {color}]}>☰</Text>
  </TouchableOpacity>
);

function App(): React.JSX.Element {
  const {theme} = useStore();
  const {t} = useTranslation();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={MenuDrawerContent}
        screenOptions={({navigation}) => ({
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
        })}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t('common.home'),
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Settings"
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
  menuButton: {
    marginLeft: 15,
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
  },
});

export default App;
