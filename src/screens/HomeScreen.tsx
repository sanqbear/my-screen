import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import useStore from '../store/useStore';
import {lightTheme, darkTheme} from '../types/theme';

const HomeScreen = () => {
  const {theme, language} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {language === 'ko' ? '홈 화면' : 'Home Screen'}
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
});

export default HomeScreen;
