import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {Buffer} from 'buffer';
import useStore from '@/store/useStore';

interface ImageCaptchaViewProps {
  visible: boolean;
  returnUrl: string;
  onSuccess: (result: {cookies: string; finalUrl: string}) => void;
  onCancel: () => void;
  cloudflareCookies: string;
  phpSessionId: string;
}

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';

export const ImageCaptchaView: React.FC<ImageCaptchaViewProps> = ({
  visible,
  returnUrl,
  onSuccess,
  onCancel,
  cloudflareCookies,
  phpSessionId,
}) => {
  const {apiUrl} = useStore();
  const [sessionId, setSessionId] = useState(phpSessionId);
  const [answer, setAnswer] = useState('');
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const getSessionId = useCallback(async () => {
    let sessionCookie = '';
    let tries = 3;

    while (tries > 0) {
      try {
        const sessionResponse = await axios.post(
          `${apiUrl}/plugin/kcaptcha/kcaptcha_session.php`,
          {},
          {
            headers: {
              'User-Agent': USER_AGENT,
              Cookie: cloudflareCookies,
              'Origin': apiUrl,
              Referer: returnUrl,
            },
            validateStatus: status => status < 500,
            maxRedirects: 0,
          },
        );

        if (sessionResponse.status === 200) {
          const cookies = sessionResponse.headers['set-cookie'];
          if (cookies) {
            console.log(cookies);
            sessionCookie =
              cookies.find(cookie => cookie.includes('PHPSESSID')) || '';
            if (sessionCookie) {
              const sid = sessionCookie.split(';')[0].split('=')[1];
              if (sid !== sessionId) {
                setSessionId(sid);
              }
              break;
            }
          }
        }
      } catch (error) {
        console.error('Session error:', error);
      }
      tries--;
      if (tries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }, [apiUrl, cloudflareCookies, sessionId, returnUrl]);

  const initCaptcha = useCallback(async () => {
    try {
      setIsLoading(true);
      setAnswer('');
      if (!sessionId) {
        await getSessionId();
      }

      // 캡차 이미지 가져오기
      const imageResponse = await axios.get(
        `${apiUrl}/plugin/kcaptcha/kcaptcha_image.php?t=${Date.now()}`,
        {
          responseType: 'arraybuffer',
          headers: {
            Cookie: `PHPSESSID=${sessionId}; ${cloudflareCookies}`,
            'User-Agent': USER_AGENT,
            Accept:
              'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            Connection: 'keep-alive',
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'same-origin',
            'Origin': apiUrl,
            Referer: apiUrl,
          },
          validateStatus: status => status < 500,
        },
      );

      if (
        imageResponse.status === 200 &&
        imageResponse.headers['content-type']?.includes('image')
      ) {
        const base64Image = Buffer.from(imageResponse.data).toString('base64');
        setCaptchaImage(base64Image);
      } else {
        console.error(
          'Invalid image response:',
          Buffer.from(imageResponse.data).toString('utf-8'),
        );
        throw new Error('캡차 이미지를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error initializing captcha:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, sessionId, cloudflareCookies, getSessionId]);

  useEffect(() => {
    if (visible) {
      initCaptcha();
    }
  }, [visible, phpSessionId, initCaptcha]);

  const handleSubmit = async (url: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/bbs/captcha_check.php`,
        new URLSearchParams({
          url: apiUrl,
          captcha_key: answer,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: `PHPSESSID=${sessionId}; ${cloudflareCookies}`,
            'User-Agent': USER_AGENT,
            'Origin': apiUrl,
            Referer: `${apiUrl}/bbs/captcha_check.php`,
          },
          maxRedirects: 0,
        },
      );

      console.log(response);

      if (response.status === 200) {
        onSuccess({
          cookies: `PHPSESSID=${sessionId}; ${cloudflareCookies}`,
          finalUrl: url,
        });
      }
    } catch (error) {
      console.error('Error submitting captcha:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>캡차 인증</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.captchaContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : captchaImage ? (
              <Image
                source={{uri: `data:image/png;base64,${captchaImage}`}}
                style={styles.captchaImage}
                resizeMode="contain"
              />
            ) : null}
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="캡차 답을 입력하세요"
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleSubmit(returnUrl)}>
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  captchaContainer: {
    padding: 20,
    alignItems: 'center',
  },
  captchaImage: {
    width: 200,
    height: 80,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
