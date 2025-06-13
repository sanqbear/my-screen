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
  const isDark = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark');
  }, [theme, colorScheme]);
  const backgroundColor = useMemo(() => {
    return isDark ? darkTheme.background : lightTheme.background;
  }, [isDark]);
  const headerTintColor = useMemo(() => {
    return isDark ? darkTheme.text : lightTheme.text;
  }, [isDark]);

  return (
    <Stack.Navigator
      initialRouteName="SettingsStack"
      screenOptions={{
        ...stackOptions,
        headerStyle: {
          backgroundColor,
        },
        contentStyle: {
          backgroundColor,
        },
      }}>
      <Stack.Screen
        name="SettingsStack"
        component={SettingsScreen}
        options={{title: t('settings.title'), headerTintColor}}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
