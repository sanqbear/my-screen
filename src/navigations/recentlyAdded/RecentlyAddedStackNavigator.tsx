import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentlyAddedScreen from '@/components/screens/RecentlyAddedScreen';
import {RecentlyAddedStackParamList} from '@/navigations/navigation';

const Stack = createNativeStackNavigator<RecentlyAddedStackParamList>();

function RecentlyAddedStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecentlyAddedStack" component={RecentlyAddedScreen} />
    </Stack.Navigator>
  );
}

export default RecentlyAddedStackNavigator;
