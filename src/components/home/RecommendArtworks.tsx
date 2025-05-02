import React from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Artwork as ArtworkType} from '@/helpers/parser';
import Artwork from './Artwork';
import {useTranslation} from 'react-i18next';

interface RecommendArtworksProps {
  artworks: ArtworkType[];
}

function RecommendArtworks({artworks}: RecommendArtworksProps): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.recommendArtworks')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {artworks.map(artwork => (
          <Artwork key={artwork.id} artwork={artwork} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default RecommendArtworks;
