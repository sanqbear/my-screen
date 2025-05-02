import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import useStore from '../store/useStore';
import {lightTheme, darkTheme} from '../types/theme';

const SettingScreen = () => {
  const {theme, language, setTheme, setLanguage} = useStore();

  // 현재 테마에 따라 테마 객체 선택
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {language === 'ko' ? '현재 테마: ' : 'Current Theme: '}
        {theme}
      </Text>
      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {language === 'ko' ? '현재 언어: ' : 'Current Language: '}
        {language}
      </Text>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.colors.primary}]}
        onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          {language === 'ko' ? '테마 변경' : 'Toggle Theme'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.colors.primary}]}
        onPress={toggleLanguage}>
        <Text style={styles.buttonText}>
          {language === 'ko' ? '언어 변경' : 'Toggle Language'}
        </Text>
      </TouchableOpacity>
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
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SettingScreen;
