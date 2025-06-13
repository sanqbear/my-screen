import useAppStore from '@/store/appStore';
import {darkTheme, lightTheme} from '@/types';
import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import SettingInformationRow from '../settings/SettingInformationRow';
import {useTranslation} from 'react-i18next';

function SettingsScreen() {
  const {theme, language, apiUrl} = useAppStore();
  const {t} = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark');
  }, [theme, colorScheme]);
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <SettingInformationRow
        title={t('settings.theme')}
        content={t(`settings.${theme}`)}
        isDark={isDark}
        onPress={() => {}}
      />
      <SettingInformationRow
        title={t('settings.language')}
        content={t(`settings.${language}`)}
        isDark={isDark}
        onPress={() => {}}
      />
      <SettingInformationRow
        title={t('settings.apiUrl')}
        content={apiUrl}
        isDark={isDark}
        onPress={() => {}}
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
