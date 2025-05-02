import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
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

function HomeLayout(): React.JSX.Element {
  const {theme, apiUrl} = useStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('API 호출에 실패했습니다.');
        }
        const html = await response.text();
        console.log(html);
        // TODO: HTML 데이터 처리 로직 추가
      } catch (error) {
        setShowErrorPopup(true);
      }
    };

    fetchData();
  }, [apiUrl]);

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
