export type Language = 'en' | 'ko' | 'ja' | 'zh';
export type ThemeType = 'system' | 'light' | 'dark';

export type Artwork = {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  oid: number | null;
  tid: number | null;
  author: string | null;
  date: string | null;
  tags: string[];
}

export type Theme = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  cardOverlay: string;
  card: string;
}

export const lightTheme: Theme = {
  primary: '#1B3F28', // primary의 어두운 버전
  secondary: '#27553B', // secondary의 어두운 버전
  background: '#EEEEEE', // 요청하신 배경
  text: '#333333', // 검정 계열, 충분한 대비
  textPrimary: '#FFFFFF', // 주요 텍스트
  textSecondary: '#CCCCCC', // 부가 텍스트
  border: '#CCCCCC', // 배경보다 조금 진한 경계
  cardOverlay: 'rgba(0, 0, 0, 0.04)', // 연한 그림자/오버레이
  card: '#F5F5F5', // background보다 조금 밝은 카드 배경
};

export const darkTheme: Theme = {
  primary: '#ECFAE5', // 요청하신 주 색상
  secondary: '#B5E6C3', // primary보다 살짝 짙고 채도 낮춘 보조 색
  background: '#222222', // 짙은 배경
  text: '#EEEEEE', // 밝은 그레이
  textPrimary: '#111111', // 주요 텍스트
  textSecondary: '#666666', // 부가 텍스트
  border: '#444444', // 어두운 경계
  cardOverlay: 'rgba(255, 255, 255, 0.05)', // 연한 오버레이
  card: '#2A2A2A', // background보다 살짝 밝은 카드 배경
};

