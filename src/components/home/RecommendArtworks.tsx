import React, {useCallback} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Artwork as ArtworkType} from '@/types';
import Artwork from './HomeArtwork';
import {useTranslation} from 'react-i18next';
import {Theme} from '@/types/theme';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@/types/navigation';

interface RecommendArtworksProps {
  artworks: ArtworkType[];
  theme: Theme;
}

const MemoizedArtwork = React.memo(Artwork);

function RecommendArtworks({
  artworks,
  theme,
}: RecommendArtworksProps): React.JSX.Element {
  const {t} = useTranslation();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const handleArtworkPress = useCallback(
    (artwork: ArtworkType) => {
      console.log('pressed');
      console.log('artwork.id', artwork.id);
      navigation.navigate('ArtworkStack', {
        screen: 'ArtworkDetail',
        params: {id: artwork.id.toString()},
      });
    },
    [navigation],
  );

  const handleMorePress = useCallback(() => {
    navigation.navigate('ArtworkStack', {
      screen: 'ArtworkList',
    });
  }, [navigation]);

  const artworkList = artworks.map(artwork => (
    <MemoizedArtwork
      key={artwork.id}
      artwork={artwork}
      theme={theme}
      onPress={() => handleArtworkPress(artwork)}
    />
  ));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {t('home.recommendArtworks')}
        </Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={handleMorePress}>
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
    padding: 5,
  },
  moreText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default RecommendArtworks;
