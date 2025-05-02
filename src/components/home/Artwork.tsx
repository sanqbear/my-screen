import React from 'react';
import {View, Image, Text, StyleSheet, Dimensions} from 'react-native';
import {Artwork as ArtworkType} from '@/helpers/parser';

interface ArtworkProps {
  artwork: ArtworkType;
}

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.3;

function Artwork({artwork}: ArtworkProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: artwork.thumbnailUrl || ''}}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>
        {artwork.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  title: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
});

export default Artwork;
