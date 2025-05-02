import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useTranslation} from 'react-i18next';
import {Language} from '@/store/useStore';
import ApiUrlLookupPopup from '@/components/settings/ApiUrlLookupPopup';
import ApiUrlSetupPopup from '@/components/settings/ApiUrlSetupPopup';

const SettingScreen = () => {
  const {theme, language, apiUrl, setTheme, setLanguage} = useStore();
  const {t} = useTranslation();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const [isLookupPopupVisible, setIsLookupPopupVisible] = useState(false);
  const [isSetupPopupVisible, setIsSetupPopupVisible] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const languages = [
    {code: 'ko' as Language, name: '한국어'},
    {code: 'en' as Language, name: 'English'},
    {code: 'ja' as Language, name: '日本語'},
    {code: 'zh' as Language, name: '中文'},
  ];

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {t('settings.currentTheme', {theme})}
      </Text>
      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {t('settings.currentLanguage', {language})}
      </Text>
      <Text style={[styles.text, {color: currentTheme.colors.text}]}>
        {t('settings.currentApiUrl', {url: apiUrl})}
      </Text>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.colors.primary}]}
        onPress={toggleTheme}>
        <Text style={styles.buttonText}>{t('settings.toggleTheme')}</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.pickerContainer,
          {backgroundColor: currentTheme.colors.background},
        ]}>
        <Picker
          selectedValue={language}
          onValueChange={(value: Language) => setLanguage(value)}
          style={[styles.picker, {color: currentTheme.colors.text}]}>
          {languages.map(lang => (
            <Picker.Item
              key={lang.code}
              label={lang.name}
              value={lang.code}
              color={currentTheme.colors.text}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.colors.primary}]}
        onPress={() => setIsLookupPopupVisible(true)}>
        <Text style={styles.buttonText}>{t('apiUrlLookup.title')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.colors.primary}]}
        onPress={() => setIsSetupPopupVisible(true)}>
        <Text style={styles.buttonText}>{t('apiUrlSetup.title')}</Text>
      </TouchableOpacity>

      <ApiUrlLookupPopup
        visible={isLookupPopupVisible}
        onClose={() => setIsLookupPopupVisible(false)}
      />

      <ApiUrlSetupPopup
        visible={isSetupPopupVisible}
        onClose={() => setIsSetupPopupVisible(false)}
      />
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
  pickerContainer: {
    width: '80%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    width: '100%',
  },
});

export default SettingScreen;
