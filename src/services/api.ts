import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import useStore from '@/store/useStore';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
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
