import React, {useMemo} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Artwork as ArtworkType} from '@/helpers/parser';
import Artwork from './HomeArtwork';
import {useTranslation} from 'react-i18next';
import {Theme} from '@/types/theme';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootStackParamList from '@/types/navigation';

interface RecommendArtworksProps {
  artworks: ArtworkType[];
  theme: Theme;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const MemoizedArtwork = React.memo(Artwork);

function RecommendArtworks({
  artworks,
  theme,
  navigation,
}: RecommendArtworksProps): React.JSX.Element {
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
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {t('home.recommendArtworks')}
        </Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            navigation.navigate('ArtworkList');
          }}>
          <Text style={[styles.moreText, {color: theme.colors.text}]}>
            {t('common.more')}
          </Text>
        </TouchableOpacity>
      </View>
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
  moreButton: {
    padding: 4,
  },
  moreText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default RecommendArtworks;
