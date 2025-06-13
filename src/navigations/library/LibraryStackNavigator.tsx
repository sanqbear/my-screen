import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LibraryScreen from '@/components/screens/LibraryScreen';
import {LibraryStackParamList} from '@/navigations/navigation';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

function LibraryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LibraryStack" component={LibraryScreen} />
    </Stack.Navigator>
  );
}

export default LibraryStackNavigator;
