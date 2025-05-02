import React, {useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useTranslation} from 'react-i18next';
import {Language} from '@/store/useStore';
import ApiUrlLookupPopup from '@/components/settings/ApiUrlLookupPopup';
import ApiUrlSetupPopup from '@/components/settings/ApiUrlSetupPopup';

const SettingButton = React.memo(
  ({
    onPress,
    title,
    color,
  }: {
    onPress: () => void;
    title: string;
    color: string;
  }) => (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: color}]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  ),
);

const SettingText = React.memo(
  ({text, color}: {text: string; color: string}) => (
    <Text style={[styles.text, {color}]}>{text}</Text>
  ),
);

const SettingScreen = () => {
  const {theme, language, apiUrl, setTheme, setLanguage} = useStore();
  const {t} = useTranslation();
  const [isLookupPopupVisible, setIsLookupPopupVisible] = useState(false);
  const [isSetupPopupVisible, setIsSetupPopupVisible] = useState(false);
  const currentTheme = useMemo(
    () => (theme === 'light' ? lightTheme : darkTheme),
    [theme],
  );

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
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <SettingText
        text={t('settings.currentTheme', {theme})}
        color={currentTheme.colors.text}
      />
      <SettingText
        text={t('settings.currentLanguage', {language})}
        color={currentTheme.colors.text}
      />
      <SettingText
        text={t('settings.currentApiUrl', {url: apiUrl})}
        color={currentTheme.colors.text}
      />

      <SettingButton
        onPress={toggleTheme}
        title={t('settings.toggleTheme')}
        color={currentTheme.colors.primary}
      />

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

      <SettingButton
        onPress={() => setIsLookupPopupVisible(true)}
        title={t('apiUrlLookup.title')}
        color={currentTheme.colors.primary}
      />

      <SettingButton
        onPress={() => setIsSetupPopupVisible(true)}
        title={t('apiUrlSetup.title')}
        color={currentTheme.colors.primary}
      />

      <ApiUrlLookupPopup
        visible={isLookupPopupVisible}
        onClose={() => setIsLookupPopupVisible(false)}
      />

      <ApiUrlSetupPopup
        visible={isSetupPopupVisible}
        onClose={() => setIsSetupPopupVisible(false)}
      />
    </SafeAreaView>
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
