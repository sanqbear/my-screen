import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Artwork as ArtworkType} from '@/types';
import {Theme} from '@/types/theme';

interface ArtworkProps {
  artwork: ArtworkType;
  theme: Theme;
  onPress: () => void;
}

function Artwork({artwork, theme, onPress}: ArtworkProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{uri: artwork.thumbnailUrl || undefined}}
        style={styles.thumbnail}
      />
      <View style={styles.info}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {artwork.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Artwork;
