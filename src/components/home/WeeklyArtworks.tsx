import React, {useMemo} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Artwork} from '@/helpers/parser';
import {useTranslation} from 'react-i18next';
import {Theme} from '@/types/theme';

interface WeeklyArtworksProps {
  artworks: Artwork[];
  theme: Theme;
}

function WeeklyArtworks({artworks, theme}: WeeklyArtworksProps): React.JSX.Element {
  const {t} = useTranslation();

  const artworkList = useMemo(
    () =>
      artworks.map(artwork => (
        <TouchableOpacity
          key={artwork.id}
          style={[styles.item, {borderBottomColor: theme.colors.border}]}
          onPress={() => {
            // TODO: 작품 상세 페이지로 이동
          }}>
          <Text style={[styles.itemTitle, {color: theme.colors.text}]}>
            {artwork.title}
          </Text>
        </TouchableOpacity>
      )),
    [artworks, theme],
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        {t('home.weeklyArtworks')}
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default WeeklyArtworks;
