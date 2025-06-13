import {Artwork, Theme} from '@/types';
import {Image, TouchableOpacity, View, Text, StyleSheet} from 'react-native';

interface ThumbnailArtworkProps {
  artwork: Artwork;
  theme: Theme;
  onPress: () => void;
}

function ThumbnailArtwork({artwork, theme, onPress}: ThumbnailArtworkProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{uri: artwork.thumbnailUrl || undefined}}
        style={styles.thumbnail}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, {color: theme.text}]}>{artwork.title}</Text>
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
    height: 180,
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ThumbnailArtwork;
