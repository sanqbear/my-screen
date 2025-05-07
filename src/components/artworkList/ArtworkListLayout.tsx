import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import useStore from '@/store/useStore';
import axios from 'axios';
import CaptchaWebView from '../captcha/CaptchaWebView';
import ImageCaptchaView from '../captcha/ImageCaptchaView';
import {Buffer} from 'buffer';
import {parseArtworkList} from '@/helpers/parser';
import {Artwork} from '@/types';
import ArtworkList from '@/components/common/ArtworkList';
import Icon from 'react-native-vector-icons/MaterialIcons';

function ArtworkListLayout(): React.JSX.Element {
  const {apiUrl} = useStore();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showImageCaptcha, setShowImageCaptcha] = useState(false);
  const [challengeUrl, setChallengeUrl] = useState('');
  const [captchaCookies, setCaptchaCookies] = useState('');
  const [captchaReferer, setCaptchaReferer] = useState('');
  const [isCaptchaInProgress, setIsCaptchaInProgress] = useState(false);
  const flatListRef = useRef<any>(null);
  const captchaCookiesRef = useRef(captchaCookies);
  const captchaRefererRef = useRef(captchaReferer);

  useEffect(() => {
    captchaCookiesRef.current = captchaCookies;
    captchaRefererRef.current = captchaReferer;
  }, [captchaCookies, captchaReferer]);

  const fetchData = useCallback(
    async (page: number, shouldRefresh: boolean = false) => {
      if (isCaptchaInProgress) {
        console.log('CAPTCHA 진행 중입니다. 요청을 건너뜁니다.');
        return;
      }

      try {
        setIsLoading(true);
        const url = page === 1 ? `${apiUrl}/comic` : `${apiUrl}/comic/p${page}`;
        console.log('Fetching URL:', url);

        // POST 요청 먼저 시도
        try {
          const postResponse = await axios.post(url, null, {
            validateStatus: status => status < 500,
            maxRedirects: 0,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.5',
              Connection: 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
              'Cache-Control': 'max-age=0',
              ...(captchaCookiesRef.current && {
                Cookie: captchaCookiesRef.current,
              }),
              ...(captchaRefererRef.current && {
                Referer: captchaRefererRef.current,
              }),
            },
          });

          console.log('POST Response Status:', postResponse.status);
          console.log('POST Response Headers:', postResponse.headers);

          if (postResponse.status === 302) {
            const location = postResponse.headers.location;
            if (location && location.includes('captcha.php')) {
              console.log('302 Redirect - Image captcha detected from POST');
              setIsCaptchaInProgress(true);
              setChallengeUrl(location);
              setShowImageCaptcha(true);
              return;
            }
          }
        } catch (postError) {
          console.log('POST request failed:', postError);
        }

        // GET 요청 시도
        const response = await axios.get(url, {
          validateStatus: status => status < 500,
          maxRedirects: 0,
          responseType: 'arraybuffer',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
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
            ...(captchaCookiesRef.current && {
              Cookie: captchaCookiesRef.current,
            }),
            ...(captchaRefererRef.current && {
              Referer: captchaRefererRef.current,
            }),
          },
        });

        if (response.status === 403) {
          console.log('403 Forbidden - Cloudflare challenge detected');
          setIsCaptchaInProgress(true);
          setChallengeUrl(url);
          setShowCaptcha(true);
          return;
        }

        if (response.status === 302) {
          const location = response.headers.location;
          if (location && location.includes('captcha.php')) {
            console.log('302 Redirect - Image captcha detected');
            setIsCaptchaInProgress(true);
            setChallengeUrl(location);
            setShowImageCaptcha(true);
            return;
          }
        }

        if (response.status >= 400) {
          throw new Error(
            `API 호출에 실패했습니다. Status: ${response.status}`,
          );
        }

        const decodedData = Buffer.from(response.data).toString('utf-8');
        const {artworks: newArtworks, hasNext: nextHasNext} =
          parseArtworkList(decodedData);
        setHasNext(nextHasNext);
        setArtworks(prev => {
          if (shouldRefresh) {
            return newArtworks;
          }
          const existingIds = new Set(prev.map(item => item.id));
          const filteredArtworks = newArtworks.filter(
            (item: Artwork) => !existingIds.has(item.id),
          );
          return [...prev, ...filteredArtworks];
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, isCaptchaInProgress],
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

  const handleCaptchaComplete = useCallback(
    (result: {cookies: string; finalUrl: string}) => {
      console.log('Captcha completed:', result);
      setCaptchaCookies(result.cookies);
      setCaptchaReferer(result.finalUrl);
      setShowCaptcha(false);
      setIsCaptchaInProgress(false);
      fetchData(1, true);
    },
    [fetchData],
  );

  const handleImageCaptchaComplete = useCallback(
    (result: {cookies: string; finalUrl: string}) => {
      console.log('Image captcha completed:', result);
      setCaptchaCookies(result.cookies);
      setCaptchaReferer(result.finalUrl);
      setShowImageCaptcha(false);
      setIsCaptchaInProgress(false);
      fetchData(1, true);
    },
    [fetchData],
  );

  if (showCaptcha) {
    return (
      <View style={styles.container}>
        <CaptchaWebView
          url={challengeUrl}
          onCaptchaComplete={handleCaptchaComplete}
        />
      </View>
    );
  }

  if (showImageCaptcha) {
    return (
      <View style={styles.container}>
        <ImageCaptchaView
          url={challengeUrl}
          onCaptchaComplete={handleImageCaptchaComplete}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ArtworkList
        ref={flatListRef}
        artworks={artworks}
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

export default ArtworkListLayout;
