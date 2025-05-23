import React, {memo} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Artwork} from '@/types';

interface ArtworkItemProps {
  artwork: Artwork;
}

const ArtworkItem: React.FC<ArtworkItemProps> = memo(
  ({artwork}) => {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: artwork.thumbnailUrl || ''}}
          style={styles.thumbnail}
          resizeMode="cover"
          defaultSource={require('@/assets/images/placeholder.svg')}
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {artwork.title}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
              {artwork.author}
            </Text>
            <View style={styles.tags}>
              {artwork.tags.map((tag, index) => (
                <Text key={index} style={styles.tag} numberOfLines={1}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.artwork.id === nextProps.artwork.id;
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  meta: {
    marginTop: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default ArtworkItem;
