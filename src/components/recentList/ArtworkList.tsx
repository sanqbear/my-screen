import React, {useCallback, forwardRef} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Artwork} from '@/helpers/parser';
import ArtworkItem from './ArtworkItem';

interface ArtworkListProps {
  artworks: Artwork[];
  onEndReached: () => void;
  onScroll?: (event: any) => void;
  onRefresh?: () => void;
  isLoading: boolean;
}

const ArtworkList = forwardRef<FlatList, ArtworkListProps>(
  ({artworks, onEndReached, onScroll, onRefresh, isLoading}, ref) => {
    const renderItem = useCallback(
      ({item}: {item: Artwork}) => <ArtworkItem artwork={item} />,
      [],
    );

    const keyExtractor = useCallback(
      (item: Artwork) => `artwork-${item.id}`,
      [],
    );

    return (
      <FlatList
        ref={ref}
        data={artworks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onScroll={onScroll}
        onRefresh={onRefresh}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
      />
    );
  },
);

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
});

export default ArtworkList;
