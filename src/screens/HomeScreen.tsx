import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HomeLayout from '@/components/home/HomeLayout';
import RootStackParamList from '@/types/navigation';

const MenuButton = React.memo(
  ({onPress, color}: {onPress: () => void; color: string}) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={[styles.menuButtonText, {color}]}>☰</Text>
    </TouchableOpacity>
  ),
);

const HomeScreen = () => {
  const {theme} = useStore();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <View style={styles.headerContainer}>
        <MenuButton
          onPress={() => navigation.openDrawer()}
          color={currentTheme.colors.text}
        />
      </View>
      <HomeLayout />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 24,
  },
});

export default HomeScreen;
