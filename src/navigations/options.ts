import DrawerToggleButton from '@/components/common/DrawerToggleButton';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

export const stackOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleAlign: 'center',
  headerLeft: DrawerToggleButton,
};
