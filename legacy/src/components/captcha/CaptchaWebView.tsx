import React, {useRef, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';

interface CaptchaWebViewProps {
  url: string;
  onCaptchaComplete?: (result: {cookies: string; finalUrl: string}) => void;
}

const CaptchaWebView: React.FC<CaptchaWebViewProps> = ({
  url,
  onCaptchaComplete,
}) => {
  const webViewRef = useRef<WebView>(null);
  const finalUrlRef = useRef<string>(url);
  const isCaptchaCompletedRef = useRef(false);

  useEffect(() => {
    // 쿠키 초기화
    CookieManager.clearAll();
  }, []);

  const checkAndHandleCaptchaCompletion = useCallback(async () => {
    if (isCaptchaCompletedRef.current) return;

    try {
      const cookies = await CookieManager.get(url);
      console.log('Checking cookies:', cookies);

      if (cookies && cookies.cf_clearance) {
        console.log('Cloudflare clearance cookie found');
        isCaptchaCompletedRef.current = true;
        const cookieString = Object.entries(cookies)
          .map(([key, value]) => `${key}=${value.value}`)
          .join('; ');

        onCaptchaComplete?.({
          cookies: cookieString,
          finalUrl: finalUrlRef.current,
        });
      }
    } catch (error) {
      console.error('Error getting cookies:', error);
    }
  }, [url, onCaptchaComplete]);

  const handleNavigationStateChange = useCallback(
    async (navState: WebViewNavigation) => {
      console.log('Navigation URL:', navState.url);
      finalUrlRef.current = navState.url;

      // Cloudflare CAPTCHA 관련 URL 체크
      if (navState.url.includes('cdn-cgi/challenge-platform')) {
        console.log('Challenge platform detected');
        return;
      }

      await checkAndHandleCaptchaCompletion();
    },
    [checkAndHandleCaptchaCompletion],
  );

  const handleShouldStartLoadWithRequest = useCallback((request: any) => {
    console.log('Request URL:', request.url);
    return true;
  }, []);

  const handleLoadProgress = useCallback(
    async (event: any) => {
      if (
        event.nativeEvent.url.includes('bootstrap') ||
        event.nativeEvent.url.includes('jquery') ||
        event.nativeEvent.url.includes('cdn-cgi/challenge-platform')
      ) {
        console.log('Challenge verification resources loaded');
        await checkAndHandleCaptchaCompletion();
      }
    },
    [checkAndHandleCaptchaCompletion],
  );

  const handleError = useCallback((event: any) => {
    console.error('WebView error:', event.nativeEvent);
  }, []);

  const handleHttpError = useCallback((event: any) => {
    console.error('WebView HTTP error:', event.nativeEvent);
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: url}}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        userAgent="Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
        onLoadProgress={handleLoadProgress}
        onError={handleError}
        onHttpError={handleHttpError}
        injectedJavaScript={`
          window.addEventListener('load', function() {
            window.ReactNativeWebView.postMessage('pageLoaded');
          });
          true;
        `}
        onMessage={event => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default CaptchaWebView;
