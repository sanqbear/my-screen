import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HomeLayout from '@/components/home/HomeLayout';

type RootParamList = {
  Home: undefined;
  Settings: undefined;
};

const MenuButton = React.memo(
  ({onPress, color}: {onPress: () => void; color: string}) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={[styles.menuButtonText, {color}]}>☰</Text>
    </TouchableOpacity>
  ),
);

const HomeScreen = () => {
  const {theme} = useStore();
  const navigation = useNavigation<DrawerNavigationProp<RootParamList>>();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <MenuButton
        onPress={() => navigation.openDrawer()}
        color={currentTheme.colors.text}
      />
      <HomeLayout />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  menuButtonText: {
    fontSize: 24,
  },
});

export default HomeScreen;
