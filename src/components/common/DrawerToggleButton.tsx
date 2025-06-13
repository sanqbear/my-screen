import React, {useMemo} from 'react';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import useAppStore from '@/store/appStore';
import {useColorScheme} from 'react-native';

function DrawerToggleButton() {
  const navigation = useNavigation();
  const {theme} = useAppStore();
  const colorScheme = useColorScheme();
  const isDark = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark');
  }, [theme, colorScheme]);

  const DrawerMemorizedButton = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Icon name="menu" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
      </TouchableOpacity>
    );
  }, [navigation, isDark]);

  return DrawerMemorizedButton;
}

export default DrawerToggleButton;
