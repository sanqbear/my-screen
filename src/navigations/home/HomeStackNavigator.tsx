import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@/components/screens/HomeScreen';
import {HomeStackParamList} from '@/navigations/navigation';
import {stackOptions} from '@/navigations/options';
import useAppStore from '@/store/appStore';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme} from '@/types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  const {theme} = useAppStore();
  const colorScheme = useColorScheme();
  const isDark =
    theme === 'dark' || (theme === 'system' && colorScheme === 'dark');

  return (
    <Stack.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        ...stackOptions,
        contentStyle: {
          backgroundColor: isDark
            ? darkTheme.colors.background
            : lightTheme.colors.background,
        },
      }}>
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
