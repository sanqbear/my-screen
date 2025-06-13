import useAppStore from '@/store/appStore';
import {darkTheme, lightTheme} from '@/types';
import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import SettingInformationRow from '../settings/SettingInformationRow';
import {useTranslation} from 'react-i18next';
import SettingSelectModal from '../settings/SettingSelectModal';
import SettingApiSetupModal from '../settings/SettingApiSetupModal';

function SettingsScreen() {
  const {theme, language, apiUrl, setTheme, setLanguage, setApiUrl} =
    useAppStore();
  const {t} = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark');
  }, [theme, colorScheme]);
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isApiUrlModalVisible, setIsApiUrlModalVisible] = useState(false);

  const handleThemePress = useCallback(
    (key: string) => {
      setTheme(key as 'light' | 'dark' | 'system');
      setIsSettingModalVisible(false);
    },
    [setTheme],
  );

  const handleLanguagePress = useCallback(
    (key: string) => {
      setLanguage(key as 'en' | 'ko' | 'ja' | 'zh');
      setIsLanguageModalVisible(false);
    },
    [setLanguage],
  );

  const handleApiUrlSubmit = useCallback(
    (url: string) => {
      if (!url.startsWith('http')) {
        setApiUrl(`https://${url}`);
      } else {
        setApiUrl(url);
      }
      setIsApiUrlModalVisible(false);
    },
    [setApiUrl],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background}]}>
      <SettingInformationRow
        title={t('settings.theme')}
        content={t(`settings.${theme}`)}
        isDark={isDark}
        onPress={() => setIsSettingModalVisible(true)}
      />
      <SettingInformationRow
        title={t('settings.language')}
        content={t(`settings.${language}`)}
        isDark={isDark}
        onPress={() => setIsLanguageModalVisible(true)}
      />
      <SettingInformationRow
        title={t('settings.apiUrl')}
        content={apiUrl}
        isDark={isDark}
        onPress={() => setIsApiUrlModalVisible(true)}
      />
      <SettingSelectModal
        visible={isSettingModalVisible}
        title={t('settings.theme')}
        items={[
          {key: 'light', name: t('settings.light')},
          {key: 'dark', name: t('settings.dark')},
          {key: 'system', name: t('settings.system')},
        ]}
        isDark={isDark}
        selectedKey={theme}
        onPressItem={handleThemePress}
        onClose={() => setIsSettingModalVisible(false)}
      />
      <SettingSelectModal
        visible={isLanguageModalVisible}
        title={t('settings.language')}
        items={[
          {key: 'en', name: t('settings.en')},
          {key: 'ko', name: t('settings.ko')},
          {key: 'ja', name: t('settings.ja')},
          {key: 'zh', name: t('settings.zh')},
        ]}
        isDark={isDark}
        selectedKey={language}
        onPressItem={handleLanguagePress}
        onClose={() => setIsLanguageModalVisible(false)}
      />
      <SettingApiSetupModal
        visible={isApiUrlModalVisible}
        isDark={isDark}
        value={apiUrl}
        onSubmit={handleApiUrlSubmit}
        onClose={() => setIsApiUrlModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
});

export default SettingsScreen;
