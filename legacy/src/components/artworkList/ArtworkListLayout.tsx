import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import useStore from '@/store/useStore';
import CaptchaWebView from '../captcha/CaptchaWebView';
import {ImageCaptchaView} from '../captcha/ImageCaptchaView';
import {Buffer} from 'buffer';
import {parseArtworkList, revealCaptchaLink} from '@/helpers/parser';
import {Artwork} from '@/types';
import ArtworkList from '@/components/common/ArtworkList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CookieManager from '@react-native-cookies/cookies';
import api from '@/services/api';

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
  const [cloudflareCookies, setCloudflareCookies] = useState('');
  const [phpSessionId, setPhpSessionId] = useState('');
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
          const postResponse = await api.post(url, null, {
            validateStatus: status => status < 500,
            maxRedirects: 0,
            headers: {
              ...(captchaCookiesRef.current && {
                Cookie: captchaCookiesRef.current,
              }),
              ...(captchaRefererRef.current && {
                Referer: captchaRefererRef.current,
              }),
            },
          });

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
        const response = await api.get(url, {
          validateStatus: status => status < 500,
          maxRedirects: 0,
          responseType: 'arraybuffer',
          headers: {
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
            setChallengeUrl(url);
            setShowImageCaptcha(true);
            return;
          }
        }

        if (response.status >= 400) {
          throw new Error(
            `API 호출에 실패했습니다. Status: ${response.status}`,
          );
        }

        if (response.headers['set-cookie']) {
          const cookies = response.headers['set-cookie'];
          setCloudflareCookies(cookies.join('; '));
          const sessionCookie = cookies.find(cookie =>
            cookie.includes('PHPSESSID'),
          );
          if (sessionCookie) {
            const sid = sessionCookie.split(';')[0].split('=')[1];
            setPhpSessionId(sid);
          }
        }

        // CookieManager를 통해 PHPSESSID 확인
        const cookies = await CookieManager.get(apiUrl);
        const sessionId = cookies.PHPSESSID?.value;
        if (sessionId) {
          setPhpSessionId(sessionId);
        }

        const decodedData = Buffer.from(response.data).toString('utf-8');
        const link = revealCaptchaLink(decodedData);
        if (link) {
          console.log('Captcha link detected');
          setIsCaptchaInProgress(true);
          setChallengeUrl(url);
          setShowImageCaptcha(true);
          return;
        }

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
        setCurrentPage(page);
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
      {showCaptcha && (
        <CaptchaWebView
          url={challengeUrl}
          onCaptchaComplete={handleCaptchaComplete}
        />
      )}
      <ImageCaptchaView
        visible={showImageCaptcha}
        returnUrl={challengeUrl}
        onSuccess={handleImageCaptchaComplete}
        onCancel={() => {
          setShowImageCaptcha(false);
          setIsCaptchaInProgress(false);
        }}
        cloudflareCookies={cloudflareCookies}
        phpSessionId={phpSessionId}
      />
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
