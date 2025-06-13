import {Artwork, Theme} from '@/types';
import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ThumbnailArtwork from './ThumbnailArtwork';

interface RecentlyAddedArtworksProps {
  artworks: Artwork[];
  theme: Theme;
}

function RecentlyAddedArtworks({artworks, theme}: RecentlyAddedArtworksProps) {
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
          {t('home.recentlyAdded')}
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
    marginVertical: 20,
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

export default RecentlyAddedArtworks;
