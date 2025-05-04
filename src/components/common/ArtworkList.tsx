import React, {useCallback, forwardRef, memo} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Artwork} from '@/helpers/parser';
import ArtworkItem from '@/components/common/ArtworkItem';

interface ArtworkListProps {
  artworks: Artwork[];
  onEndReached: () => void;
  onScroll?: (event: any) => void;
  onRefresh?: () => void;
  isLoading: boolean;
}

const ArtworkList = memo(
  forwardRef<FlatList, ArtworkListProps>(
    ({artworks, onEndReached, onScroll, onRefresh, isLoading}, ref) => {
      const renderItem = useCallback(
        ({item}: {item: Artwork}) => <ArtworkItem artwork={item} />,
        [],
      );

      const keyExtractor = useCallback(
        (item: Artwork) => `artwork-${item.id}`,
        [],
      );

      const getItemLayout = useCallback(
        (_: any, index: number) => ({
          length: 140, // 아이템의 고정된 높이
          offset: 140 * index,
          index,
        }),
        [],
      );

      return (
        <FlatList
          ref={ref}
          data={artworks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          onScroll={onScroll}
          onRefresh={onRefresh}
          refreshing={isLoading}
          contentContainerStyle={styles.list}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}
        />
      );
    },
  ),
);

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
});

export default ArtworkList;
