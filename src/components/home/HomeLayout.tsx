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
import CookieManager from '@react-native-cookies/cookies';
import api from '@/services/api';

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

  const getCookiesFromResponse = useCallback(async () => {
    const cookies = await CookieManager.get(apiUrl);
    return cookies;
  }, [apiUrl]);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(apiUrl, {
        validateStatus: status => status < 500,
        maxRedirects: 0,
        withCredentials: true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Edg/136.0.0.0',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
          Origin: apiUrl,
        },
      });

      console.log('GET Response Status:', response.status);
      console.log('GET Response Headers:', response.headers);

      // react-native-cookies를 사용해서 쿠키 확인
      const cookies = await getCookiesFromResponse();
      console.log('GET Response Cookies:', cookies);

      // set-cookie 헤더 추출
      const html = response.data;
      const host = apiUrl.match(/^https?:\/\/[^/]+/)?.[0] || '';
      const parsedArtworks = parseHomeArtworks(html, host);
      setArtworks(parsedArtworks);
    } catch (error) {
      console.log(error);
      setShowErrorPopup(true);
    } finally {
      setRefreshing(false);
    }
  }, [apiUrl, getCookiesFromResponse]);

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
