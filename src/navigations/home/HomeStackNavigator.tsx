import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@/components/screens/HomeScreen';
import {HomeStackParamList} from '@/navigations/navigation';
import {stackOptions} from '@/navigations/options';
import useAppStore from '@/store/appStore';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme} from '@/types';
import {useMemo} from 'react';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  const {theme} = useAppStore();
  const colorScheme = useColorScheme();
  const currentTheme = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark')
      ? darkTheme
      : lightTheme;
  }, [theme, colorScheme]);

  return (
    <Stack.Navigator
      initialRouteName="HomeStack"
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
        name="HomeStack"
        component={HomeScreen}
        options={{title: '', headerTintColor: currentTheme.text}}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
