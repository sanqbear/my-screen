import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BookmarksStackParamList} from '@/navigations/navigation';
import BookmarksScreen from '@/components/screens/BookmarksScreen';

const Stack = createNativeStackNavigator<BookmarksStackParamList>();

function BookmarksStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookmarksStack" component={BookmarksScreen} />
    </Stack.Navigator>
  );
}

export default BookmarksStackNavigator;
