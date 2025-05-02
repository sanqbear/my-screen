import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Artwork} from '@/helpers/parser';

interface RecommendArtworksProps {
  artworks: Artwork[];
}

function RecommendArtworks({artworks}: RecommendArtworksProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 작품</Text>
      {/* TODO: artworks 데이터를 사용하여 UI 구현 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default RecommendArtworks;
