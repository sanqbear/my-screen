import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

type RootParamList = {
  Home: undefined;
  Settings: undefined;
};

const HomeScreen = () => {
  const {theme} = useStore();
  const {t} = useTranslation();
  const navigation = useNavigation<DrawerNavigationProp<RootParamList>>();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}>
        <Text
          style={[styles.menuButtonText, {color: currentTheme.colors.text}]}>
          ☰
        </Text>
      </TouchableOpacity>

      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {t('home.title')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
  },
});

export default HomeScreen;
