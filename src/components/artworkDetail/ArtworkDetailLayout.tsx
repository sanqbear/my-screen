import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import useStore from '@/store/useStore';
import axios from 'axios';
import {Buffer} from 'buffer';
import CaptchaWebView from '../captcha/CaptchaWebView';
import {parseArtworkDetail} from '@/helpers/parser';

interface Props {
  id: string;
}

function ArtworkDetailLayout({id}: Props): React.JSX.Element {
  const {apiUrl} = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [challengeUrl, setChallengeUrl] = useState('');
  const [captchaCookies, setCaptchaCookies] = useState('');
  const [captchaReferer, setCaptchaReferer] = useState('');
  const [isCaptchaInProgress, setIsCaptchaInProgress] = useState(false);

  const fetchData = useCallback(async () => {
    if (isCaptchaInProgress) {
      console.log('CAPTCHA 진행 중입니다. 요청을 건너뜁니다.');
      return;
    }

    try {
      setIsLoading(true);
      const url = `${apiUrl}/comic/${id}`;
      console.log('Fetching URL:', url);

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
          ...(captchaCookies && {Cookie: captchaCookies}),
          ...(captchaReferer && {Referer: captchaReferer}),
        },
      });

      if (response.status === 403) {
        console.log('403 Forbidden - Cloudflare challenge detected');
        setIsCaptchaInProgress(true);
        setChallengeUrl(url);
        setShowCaptcha(true);
        return;
      }

      if (response.status >= 400) {
        throw new Error(`API 호출에 실패했습니다. Status: ${response.status}`);
      }

      const decodedData = Buffer.from(response.data).toString('utf-8');
      console.log(decodedData);
      const artworkDetail = parseArtworkDetail(decodedData);
      console.log('Artwork detail:', artworkDetail);
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, id, captchaCookies, captchaReferer, isCaptchaInProgress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (showCaptcha) {
    return (
      <View style={styles.container}>
        <CaptchaWebView
          url={challengeUrl}
          onCaptchaComplete={result => {
            console.log('Captcha completed:', result);
            setCaptchaCookies(result.cookies);
            setCaptchaReferer(result.finalUrl);
            setShowCaptcha(false);
            setIsCaptchaInProgress(false);
            fetchData();
          }}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ArtworkDetailLayout;
