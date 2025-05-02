import React, {useEffect, useState, useCallback} from 'react';
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
import {parseHomeArtworks, HomeArtworks} from '@/helpers/parser';

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
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
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
          <RecentArtworks artworks={artworks.recent} />
        </View>
        <View style={styles.section}>
          <RecommendArtworks artworks={artworks.recommend} />
        </View>
        <View style={styles.section}>
          <WeeklyArtworks artworks={artworks.weekly} />
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
