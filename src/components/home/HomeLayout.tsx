import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import RecentArtworks from './RecentArtworks';
import RecommendArtworks from './RecommendArtworks';
import WeeklyArtworks from './WeeklyArtworks';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';

function HomeLayout(): React.JSX.Element {
  const {theme} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <View style={styles.section}>
        <RecentArtworks />
      </View>
      <View style={styles.section}>
        <RecommendArtworks />
      </View>
      <View style={styles.section}>
        <WeeklyArtworks />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
});

export default HomeLayout;
