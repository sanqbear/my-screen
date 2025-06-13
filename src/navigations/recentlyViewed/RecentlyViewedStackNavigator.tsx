import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentlyViewedScreen from '@/components/screens/RecentlyViewedScreen';
import {RecentlyViewedStackParamList} from '@/navigations/navigation';

const Stack = createNativeStackNavigator<RecentlyViewedStackParamList>();

function RecentlyViewedStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecentlyViewedStack"
        component={RecentlyViewedScreen}
      />
    </Stack.Navigator>
  );
}

export default RecentlyViewedStackNavigator;
