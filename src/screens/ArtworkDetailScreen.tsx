import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ArtworkDetailLayout from '@/components/artworkDetail/ArtworkDetailLayout';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ArtworkStackParamList} from '@/types/navigation';

type Props = NativeStackScreenProps<ArtworkStackParamList, 'ArtworkDetail'>;

function ArtworkDetailScreen({route}: Props): React.JSX.Element {
  const {id} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ArtworkDetailLayout id={id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ArtworkDetailScreen;
