import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import useStore from '@/store/useStore';

const USER_AGENT = 'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';
const ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
const ACCEPT_LANGUAGE = 'en-US,en;q=0.5';
const CONNECTION = 'keep-alive';
const UPGRADE_INSECURE_REQUESTS = '1';
const SEC_FETCH_DEST = 'document';
const SEC_FETCH_MODE = 'navigate';
const SEC_FETCH_SITE = 'none';
const SEC_FETCH_USER = '?1';
const CACHE_CONTROL = 'max-age=0';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': ACCEPT,
        'Accept-Language': ACCEPT_LANGUAGE,
        'Connection': CONNECTION,
        'Upgrade-Insecure-Requests': UPGRADE_INSECURE_REQUESTS,
        'Sec-Fetch-Dest': SEC_FETCH_DEST,
        'Sec-Fetch-Mode': SEC_FETCH_MODE,
        'Sec-Fetch-Site': SEC_FETCH_SITE,
        'Sec-Fetch-User': SEC_FETCH_USER,
        'Cache-Control': CACHE_CONTROL,
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async config => {
        try {
          const {apiUrl, phpSessionId} = useStore.getState();

          if (!phpSessionId) {
            const cookies = await CookieManager.get(apiUrl);
            const newPhpSessionId = cookies?.PHPSESSID?.value;
            if (newPhpSessionId) {
              useStore.getState().setPhpSessionId(newPhpSessionId);
              config.headers.Cookie = `PHPSESSID=${newPhpSessionId}`;
            }
          }
        } catch (error) {
          console.error('Error getting cookies:', error);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  public async head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.head<T>(url, config);
  }
}

export default ApiService.getInstance();
