import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerParamList} from './navigation';
import HomeStackNavigator from './home/HomeStackNavigator';
import SettingsStackNavigator from './settings/SettingsStackNavigator';

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
      }}>
      <Drawer.Screen name="Home" component={HomeStackNavigator} />
      <Drawer.Screen name="Settings" component={SettingsStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
