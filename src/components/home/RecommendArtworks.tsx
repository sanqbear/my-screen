import React, {useMemo} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Artwork as ArtworkType} from '@/helpers/parser';
import Artwork from './Artwork';
import {useTranslation} from 'react-i18next';
import {Theme} from '@/types/theme';

interface RecommendArtworksProps {
  artworks: ArtworkType[];
  theme: Theme;
}

const MemoizedArtwork = React.memo(Artwork);

function RecommendArtworks({artworks, theme}: RecommendArtworksProps): React.JSX.Element {
  const {t} = useTranslation();

  const artworkList = useMemo(
    () =>
      artworks.map(artwork => (
        <MemoizedArtwork key={artwork.id} artwork={artwork} theme={theme} />
      )),
    [artworks, theme],
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        {t('home.recommendArtworks')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {artworkList}
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
