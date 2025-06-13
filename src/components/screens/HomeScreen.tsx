import {getHomepageData} from '@/api';
import useAppStore from '@/store/appStore';
import {Artwork, darkTheme, lightTheme} from '@/types';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RecentlyAddedArtworks from '../home/RecentlyAddedArtworks';
import LibraryArtworks from '../home/LibraryArtworks';
import WeeklyArtworks from '../home/WeeklyArtworks';

function HomeScreen() {
  const [homeArtworks, setHomeArtworks] = useState<{
    recentlyAdded: Artwork[];
    library: Artwork[];
    weekly: Artwork[];
  } | null>(null);
  const {apiUrl, theme} = useAppStore();
  const colorScheme = useColorScheme();
  const currentTheme = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && colorScheme === 'dark')
      ? darkTheme
      : lightTheme;
  }, [theme, colorScheme]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomepageData = async (url: string) => {
    const results = await getHomepageData(url);
    setHomeArtworks(results);
    setRefreshing(false);
  };

  useEffect(() => {
    if (apiUrl) {
      fetchHomepageData(apiUrl);
    }
  }, [apiUrl]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchHomepageData(apiUrl);
  }, [apiUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.primary}
          />
        }>
        {homeArtworks && homeArtworks.recentlyAdded.length > 0 && (
          <RecentlyAddedArtworks
            artworks={homeArtworks.recentlyAdded}
            theme={currentTheme}
          />
        )}
        {homeArtworks && homeArtworks.library.length > 0 && (
          <LibraryArtworks
            artworks={homeArtworks.library}
            theme={currentTheme}
          />
        )}
        {homeArtworks && homeArtworks.weekly.length > 0 && (
          <WeeklyArtworks artworks={homeArtworks.weekly} theme={currentTheme} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
