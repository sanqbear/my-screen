import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import axios from 'axios';
import {Buffer} from 'buffer';

interface ImageCaptchaViewProps {
  url: string;
  onCaptchaComplete: (result: {cookies: string; finalUrl: string}) => void;
}

function ImageCaptchaView({url, onCaptchaComplete}: ImageCaptchaViewProps) {
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [answer, setAnswer] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const initCaptcha = async () => {
      try {
        // 세션 초기화
        const sessionResponse = await axios.post(
          `${url}/plugin/kcaptcha/kcaptcha_session.php`,
          {},
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
            },
          },
        );

        const cookies = sessionResponse.headers['set-cookie'];
        if (cookies) {
          const sessionCookie = cookies.find(cookie =>
            cookie.includes('PHPSESSID'),
          );
          if (sessionCookie) {
            const sessionId = sessionCookie.split(';')[0].split('=')[1];
            setSessionId(sessionId);
          }
        }

        // 캡차 이미지 가져오기
        const imageResponse = await axios.get(
          `${url}/plugin/kcaptcha/kcaptcha_image.php?t=${Date.now()}`,
          {
            responseType: 'arraybuffer',
            headers: {
              Cookie: `PHPSESSID=${sessionId}`,
            },
          },
        );

        const base64Image = Buffer.from(imageResponse.data).toString('base64');
        setCaptchaImage(`data:image/png;base64,${base64Image}`);
      } catch (error) {
        console.error('Error initializing captcha:', error);
      }
    };

    initCaptcha();
  }, [url]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}/bbs/captcha_check.php`,
        new URLSearchParams({
          url: url,
          captcha_key: answer,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: `PHPSESSID=${sessionId}`,
          },
        },
      );

      if (response.status === 200) {
        onCaptchaComplete({
          cookies: `PHPSESSID=${sessionId}`,
          finalUrl: url,
        });
      }
    } catch (error) {
      console.error('Error submitting captcha:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.webviewContainer}>
        <Text style={styles.url}>{url}</Text>
      </View>
      <View style={styles.captchaContainer}>
        {captchaImage ? (
          <Image source={{uri: captchaImage}} style={styles.captchaImage} />
        ) : null}
        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          placeholder="캡차 답을 입력하세요"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewContainer: {
    height: 100,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  url: {
    fontSize: 12,
    color: '#666',
  },
  captchaContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  captchaImage: {
    width: 200,
    height: 80,
    marginBottom: 20,
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

export default ImageCaptchaView; 