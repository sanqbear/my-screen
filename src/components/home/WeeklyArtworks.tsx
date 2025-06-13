import {Artwork, Theme} from '@/types';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface WeeklyArtworksProps {
  artworks: Artwork[];
  theme: Theme;
}

function WeeklyArtworks({artworks, theme}: WeeklyArtworksProps) {
  const {t} = useTranslation();

  const items = useMemo(
    () =>
      artworks.map(artwork => (
        <TouchableOpacity
          key={artwork.id}
          style={[styles.item, {borderColor: theme.border}]}
          onPress={() => {}}>
          <Text style={[styles.itemTitle, {color: theme.text}]}>
            {artwork.title}
          </Text>
        </TouchableOpacity>
      )),
    [artworks, theme],
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.text}]}>
        {t('home.weekly')}
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default WeeklyArtworks;
