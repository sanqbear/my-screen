import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import useStore from '@/store/useStore';
import {parseRecentArtworks} from '@/helpers/parser';
import ArtworkList from '@/components/common/ArtworkList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Artwork} from '@/types';

function RecentListLayout(): React.JSX.Element {
  const {apiUrl} = useStore();
  const [recentArtworks, setRecentArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const flatListRef = useRef<any>(null);

  const fetchData = useCallback(
    async (page: number, shouldRefresh: boolean = false) => {
      try {
        setIsLoading(true);
        const url = `${apiUrl}/bbs/page.php?hid=update&page=${page}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('API 호출에 실패했습니다.');
        }
        const html = await response.text();
        const {artworks, hasNext: nextHasNext} = parseRecentArtworks(
          html,
          apiUrl,
        );
        setHasNext(nextHasNext);
        setRecentArtworks(prev => {
          if (shouldRefresh) {
            return artworks;
          }
          const existingIds = new Set(prev.map(item => item.id));
          const newArtworks = artworks.filter(
            item => !existingIds.has(item.id),
          );
          return [...prev, ...newArtworks];
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl],
  );

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasNext) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage);
    }
  }, [currentPage, fetchData, isLoading, hasNext]);

  const handleScroll = useCallback((event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowScrollTop(y > 500);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  }, []);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasNext(true);
    fetchData(1, true);
  }, [fetchData]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <ArtworkList
        ref={flatListRef}
        artworks={recentArtworks}
        onEndReached={handleEndReached}
        onScroll={handleScroll}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <Icon name="arrow-upward" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecentListLayout;
