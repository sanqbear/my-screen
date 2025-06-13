import React, {useMemo} from 'react';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

function DrawerToggleButton() {
  const navigation = useNavigation();

  const DrawerMemorizedButton = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Icon name="menu" size={24} color="black" />
      </TouchableOpacity>
    );
  }, [navigation]);

  return DrawerMemorizedButton;
}

export default DrawerToggleButton;
