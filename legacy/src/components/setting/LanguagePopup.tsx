import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Language} from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import useStore from '@/store/useStore';

type LanguagePopupProps = {
  visible: boolean;
  onClose: () => void;
};

const LanguagePopup = ({visible, onClose}: LanguagePopupProps) => {
  const {t} = useTranslation();
  const {theme, language, setLanguage} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const languages = [
    {code: 'ko' as Language, name: '한국어'},
    {code: 'en' as Language, name: 'English'},
    {code: 'ja' as Language, name: '日本語'},
    {code: 'zh' as Language, name: '中文'},
  ];

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.modalContent,
            {backgroundColor: currentTheme.colors.background},
          ]}>
          <Text
            style={[styles.title, {color: currentTheme.colors.text}]}
            numberOfLines={1}>
            {t('settings.language')}
          </Text>
          <View style={styles.languageList}>
            {languages.map(lang => {
              const isSelected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    isSelected && {
                      backgroundColor: currentTheme.colors.primary,
                    },
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}>
                  <Text
                    style={[
                      styles.languageText,
                      isSelected && styles.selectedLanguageText,
                      !isSelected && {color: currentTheme.colors.text},
                    ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Pressable>
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
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageList: {
    gap: 10,
  },
  languageItem: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    color: '#FFFFFF',
  },
});

export default LanguagePopup;
