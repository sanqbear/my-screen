import {Artwork, Theme} from '@/types';
import ThumbnailArtwork from './ThumbnailArtwork';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface LibraryArtworksProps {
  artworks: Artwork[];
  theme: Theme;
}

function LibraryArtworks({artworks, theme}: LibraryArtworksProps) {
  const {t} = useTranslation();
  const items = useMemo(
    () =>
      artworks.map(artwork => (
        <ThumbnailArtwork
          key={artwork.id}
          artwork={artwork}
          theme={theme}
          onPress={() => {}}
        />
      )),
    [artworks, theme],
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.text}]}>
          {t('home.library')}
        </Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, {color: theme.text}]}>
            {t('home.viewAll')}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {items}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default LibraryArtworks;
