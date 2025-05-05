import React, {useRef, useEffect} from 'react';
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

  useEffect(() => {
    // 쿠키 초기화
    CookieManager.clearAll();
  }, []);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    console.log('Navigation URL:', navState.url);
    finalUrlRef.current = navState.url;

    // Cloudflare CAPTCHA 관련 URL 체크
    if (navState.url.includes('cdn-cgi/challenge-platform')) {
      console.log('Challenge platform detected');
      return;
    }

    // 쿠키 정보 로깅
    try {
      const cookies = await CookieManager.get(url);
      console.log('Cookies:', cookies);

      // cf_clearance 쿠키가 있으면 캡차 완료로 간주
      if (cookies && cookies.cf_clearance) {
        console.log('Cloudflare clearance cookie found');
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
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    console.log('Request URL:', request.url);
    console.log('Request Headers:', request.headers);

    // Cloudflare 캡차 URL로 리다이렉션되는 경우 허용
    if (request.url.includes('cdn-cgi/challenge-platform')) {
      console.log('Allowing challenge platform URL');
      return true;
    }

    return true;
  };

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
        onLoadProgress={event => {
          if (
            event.nativeEvent.url.includes('bootstrap') ||
            event.nativeEvent.url.includes('jquery') ||
            event.nativeEvent.url.includes('cdn-cgi/challenge-platform')
          ) {
            console.log('Challenge verification resources loaded');
            // 쿠키 확인 및 처리
            CookieManager.get(url).then(cookies => {
              console.log('Cookies after challenge:', cookies);
              if (cookies && cookies.cf_clearance) {
                console.log('Cloudflare clearance cookie found');
                const cookieString = Object.entries(cookies)
                  .map(([key, value]) => `${key}=${value.value}`)
                  .join('; ');

                onCaptchaComplete?.({
                  cookies: cookieString,
                  finalUrl: finalUrlRef.current,
                });
              }
            });
          }
        }}
        onError={event => {
          console.error('WebView error:', event.nativeEvent);
          // 에러 발생 시 페이지 다시 로드
          webViewRef.current?.reload();
        }}
        onHttpError={event => {
          console.error('WebView HTTP error:', event.nativeEvent);
          // HTTP 에러 발생 시 페이지 다시 로드
          webViewRef.current?.reload();
        }}
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
