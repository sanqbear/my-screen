import React, {useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useTranslation} from 'react-i18next';
import {Language} from '@/store/useStore';
import UrlLookupPopup from '@/components/setting/UrlLookupPopup';
import UrlSetupPopup from '@/components/setting/UrlSetupPopup';

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

const SettingItem = React.memo(
  ({
    title,
    content,
    color,
  }: {
    title: string;
    content: string;
    color: string;
  }) => (
    <View style={styles.settingItem}>
      <Text style={[styles.settingTitle, {color}]}>{title}</Text>
      <Text style={[styles.settingContent, {color}]}>{content}</Text>
    </View>
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
      <View style={styles.settingsContainer}>
        <SettingItem
          title={t('settings.theme')}
          content={t(`settings.${theme}`)}
          color={currentTheme.colors.text}
        />
        <SettingItem
          title={t('settings.language')}
          content={languages.find(lang => lang.code === language)?.name || ''}
          color={currentTheme.colors.text}
        />
        <SettingItem
          title={t('settings.apiUrl')}
          content={apiUrl}
          color={currentTheme.colors.text}
        />
      </View>

      <View style={styles.controlsContainer}>
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
          title={t('urlLookup.title')}
          color={currentTheme.colors.primary}
        />

        <SettingButton
          onPress={() => setIsSetupPopupVisible(true)}
          title={t('urlSetup.title')}
          color={currentTheme.colors.primary}
        />
      </View>

      <UrlLookupPopup
        visible={isLookupPopupVisible}
        onClose={() => setIsLookupPopupVisible(false)}
      />

      <UrlSetupPopup
        visible={isSetupPopupVisible}
        onClose={() => setIsSetupPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingsContainer: {
    flex: 1,
    gap: 20,
  },
  controlsContainer: {
    gap: 15,
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingContent: {
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    width: '100%',
  },
});

export default SettingScreen;
