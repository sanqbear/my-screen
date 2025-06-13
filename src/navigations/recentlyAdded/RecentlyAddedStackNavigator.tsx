import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentlyAddedScreen from '@/components/screens/RecentlyAddedScreen';
import {RecentlyAddedStackParamList} from '@/navigations/navigation';
import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import useAppStore from '@/store/appStore';
import {darkTheme, lightTheme} from '@/types';
import {useTranslation} from 'react-i18next';
import {stackOptions} from '../options';

const Stack = createNativeStackNavigator<RecentlyAddedStackParamList>();

function RecentlyAddedStackNavigator() {
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
      initialRouteName="RecentlyAddedStack"
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
        name="RecentlyAddedStack"
        component={RecentlyAddedScreen}
        options={{
          title: t('recentlyAdded.title'),
          headerTintColor: currentTheme.text,
        }}
      />
    </Stack.Navigator>
  );
}

export default RecentlyAddedStackNavigator;
