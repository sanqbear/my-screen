import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsScreen from '@/components/screens/SettingsScreen';
import {SettingsStackParamList} from '@/navigations/navigation';
import {stackOptions} from '@/navigations/options';
import useAppStore from '@/store/appStore';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme} from '@/types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsStackNavigator() {
  const {t} = useTranslation();
  const {theme} = useAppStore();
  const colorScheme = useColorScheme();
  const isDark =
    theme === 'dark' || (theme === 'system' && colorScheme === 'dark');

  return (
    <Stack.Navigator
      initialRouteName="SettingsStack"
      screenOptions={{
        ...stackOptions,
        contentStyle: {
          backgroundColor: isDark
            ? darkTheme.colors.background
            : lightTheme.colors.background,
        },
      }}>
      <Stack.Screen
        name="SettingsStack"
        component={SettingsScreen}
        options={{title: t('settings.title')}}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
