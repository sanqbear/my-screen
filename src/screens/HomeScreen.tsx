import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import useStore from '../store/useStore';
import {lightTheme, darkTheme} from '../types/theme';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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

      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.colors.primary}]}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>
          {language === 'ko' ? '설정으로 이동' : 'Go to Settings'}
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
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default HomeScreen;
