import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsScreen from '@/components/screens/SettingsScreen';
import {SettingsStackParamList} from '@/navigations/navigation';
import {stackOptions} from '@/navigations/options';
import useAppStore from '@/store/appStore';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme} from '@/types';
import {useMemo} from 'react';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsStackNavigator() {
  const {t} = useTranslation();
  const {theme} = useAppStore();
  const colorScheme = useColorScheme();
  const currentTheme = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark')
      ? darkTheme
      : lightTheme;
  }, [theme, colorScheme]);

  return (
    <Stack.Navigator
      initialRouteName="SettingsStack"
      screenOptions={{
        ...stackOptions,
        headerStyle: {
          backgroundColor: currentTheme.background,
        },
        contentStyle: {
          backgroundColor: currentTheme.background,
        },
      }}>
      <Stack.Screen
        name="SettingsStack"
        component={SettingsScreen}
        options={{
          title: t('settings.title'),
          headerTintColor: currentTheme.text,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
