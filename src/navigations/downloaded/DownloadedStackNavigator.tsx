import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DownloadedScreen from '@/components/screens/DownloadedScreen';
import {DownloadedStackParamList} from '@/navigations/navigation';

const Stack = createNativeStackNavigator<DownloadedStackParamList>();

function DownloadedStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DownloadedStack" component={DownloadedScreen} />
    </Stack.Navigator>
  );
}

export default DownloadedStackNavigator;
