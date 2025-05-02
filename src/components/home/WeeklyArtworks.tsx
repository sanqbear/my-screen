import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Artwork} from '@/helpers/parser';
import {useTranslation} from 'react-i18next';

interface WeeklyArtworksProps {
  artworks: Artwork[];
}

function WeeklyArtworks({artworks}: WeeklyArtworksProps): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.weeklyArtworks')}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {artworks.map(artwork => (
          <TouchableOpacity
            key={artwork.id}
            style={styles.item}
            onPress={() => {
              // TODO: 작품 상세 페이지로 이동
            }}>
            <Text style={styles.itemTitle}>{artwork.title}</Text>
          </TouchableOpacity>
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
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default WeeklyArtworks;
