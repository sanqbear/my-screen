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
      initialRouteName="HomeStack"
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
        name="HomeStack"
        component={HomeScreen}
        options={{title: '', headerTintColor}}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
