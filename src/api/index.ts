import useSessionStore from '@/store/sessionStore';
import {parseHomeArtworks} from '@/utils/htmlParser';
import ReactNativeBlobUtil from 'react-native-blob-util';

const removeAllNumbers = (url: string) => {
  return url.replace(/\d/g, '');
};

const getHost = (url: string) => {
  return url.match(/^https?:\/\/[^/]+/)?.[0] || '';
};

const getHtmlData = async (url: string) => {
  try {
    const options: {[key: string]: string} = {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'max-age=0',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
    const currentPhpSession = useSessionStore.getState().phpSession;

    if (currentPhpSession) {
      options.Cookie = `PHPSESSID=${currentPhpSession}`;
    }

    const response = await ReactNativeBlobUtil.config({
      followRedirect: false,
      timeout: 3000,
    }).fetch('GET', url, options);
    const info = response.info();
    const headers = info.headers;
    const setCookie = headers.setCookie;
    const phpSession = setCookie?.PHPSESSID;
    if (phpSession) {
      useSessionStore.getState().setPhpSession(phpSession);
    }
    return response.data;
  } catch (e) {
    console.error('GET HTML DATA ERROR:', e);
  }
};

export const generateLookupUrl = (url: string, index: number) => {
  try {
    // URL에서 프로토콜과 도메인을 분리
    const protocolMatch = url.match(/^(https?:\/\/)/);
    const protocol = protocolMatch ? protocolMatch[0] : 'https://';
    const domainAndPath = url.replace(/^(https?:\/\/)/, '');

    // 도메인과 경로를 분리
    const [domain, ...pathParts] = domainAndPath.split('/');
    const path = pathParts.length > 0 ? '/' + pathParts.join('/') : '';

    // 도메인을 부분으로 분리
    const domainParts = domain.split('.');

    // 도메인 이름의 첫 부분에 번호를 삽입
    if (domainParts.length >= 2) {
      domainParts[0] = `${domainParts[0]}${index}`;
    }

    // URL을 재구성
    return `${protocol}${domainParts.join('.')}${path}`;
  } catch (e) {
    console.error('URL generation error:', e);
    return url;
  }
};

export const checkUrl = async (url: string): Promise<string> => {
  try {
    const response = await ReactNativeBlobUtil.config({
      followRedirect: false,
      timeout: 3000,
    }).fetch('GET', url);

    const info = response.info();
    const serverHeader = info.headers.server;
    const cfrayHeader = info.headers['cf-ray'];
    const pragmaHeader = info.headers.pragma;
    const isOk = info.status === 200;

    const locationHeader = info.headers.location?.endsWith('/')
      ? info.headers.location.slice(0, -1)
      : info.headers.location;
    const isRedirect = info.status === 301 || info.status === 302;

    if (isOk && serverHeader === 'cloudflare' && cfrayHeader && pragmaHeader) {
      return url;
    } else if (
      isRedirect &&
      locationHeader &&
      removeAllNumbers(locationHeader) === removeAllNumbers(url)
    ) {
      if ((await checkUrl(locationHeader)) !== '') {
        return locationHeader;
      }
    }

    return '';
  } catch {
    return '';
  }
};

export const getHomepageData = async (url: string) => {
  const htmlData = await getHtmlData(url);
  const host = getHost(url);
  const homeArtworks = parseHomeArtworks(htmlData, host);
  return homeArtworks;
};
