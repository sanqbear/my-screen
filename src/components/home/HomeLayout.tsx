import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import RecentArtworks from './RecentArtworks';
import RecommendArtworks from './RecommendArtworks';
import WeeklyArtworks from './WeeklyArtworks';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation';
import MessagePopup from '@/components/common/MessagePopup';
import {useTranslation} from 'react-i18next';
import {parseHomeArtworks} from '@/helpers/parser';
import {HomeArtworks} from '@/types';

const MemoizedRecentArtworks = React.memo(RecentArtworks);
const MemoizedRecommendArtworks = React.memo(RecommendArtworks);
const MemoizedWeeklyArtworks = React.memo(WeeklyArtworks);

function HomeLayout(): React.JSX.Element {
  const {theme, apiUrl} = useStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [artworks, setArtworks] = useState<HomeArtworks>({
    recent: [],
    recommend: [],
    weekly: [],
  });
  const currentTheme = useMemo(
    () => (theme === 'light' ? lightTheme : darkTheme),
    [theme],
  );
  const {t} = useTranslation();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('API 호출에 실패했습니다.');
      }
      const html = await response.text();
      const host = apiUrl.match(/^https?:\/\/[^/]+/)?.[0] || '';
      const parsedArtworks = parseHomeArtworks(html, host);
      setArtworks(parsedArtworks);
    } catch (error) {
      console.log(error);
      setShowErrorPopup(true);
    } finally {
      setRefreshing(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleErrorPopupConfirm = () => {
    setShowErrorPopup(false);
    navigation.navigate('Setting');
  };

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          {backgroundColor: currentTheme.colors.background},
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.colors.primary}
          />
        }>
        <View style={styles.section}>
          <MemoizedRecentArtworks
            artworks={artworks.recent}
            theme={currentTheme}
            navigation={navigation}
          />
        </View>
        <View style={styles.section}>
          <MemoizedRecommendArtworks
            artworks={artworks.recommend}
            theme={currentTheme}
          />
        </View>
        <View style={styles.section}>
          <MemoizedWeeklyArtworks
            artworks={artworks.weekly}
            theme={currentTheme}
          />
        </View>
      </ScrollView>
      <MessagePopup
        visible={showErrorPopup}
        title={t('home.apiError.title')}
        message={t('home.apiError.message')}
        onConfirm={handleErrorPopupConfirm}
        confirmText={t('home.apiError.goToSettings')}
      />
    </>
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
