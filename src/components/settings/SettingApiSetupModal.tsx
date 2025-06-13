import {darkTheme, lightTheme} from '@/types';
import {useMemo} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-gesture-handler';

interface SettingApiSetupModalProps {
  visible: boolean;
  isDark: boolean;
  value: string;
  onSubmit: (url: string) => void;
  onPressLookup: () => void;
  onClose: () => void;
}

function SettingApiSetupModal({
  visible,
  isDark,
  value,
  onSubmit,
  onPressLookup,
  onClose,
}: SettingApiSetupModalProps) {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);
  const {t} = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={[styles.overlay, {backgroundColor: currentTheme.cardOverlay}]}
        onPress={onClose}>
        <View style={[styles.container, {backgroundColor: currentTheme.card}]}>
          <Text
            numberOfLines={1}
            style={[styles.title, {color: currentTheme.text}]}>
            {t('settings.setupApiUrl')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.text,
                borderColor: currentTheme.border,
                backgroundColor: currentTheme.background,
              },
            ]}
            value={value}
            placeholder={t('settings.apiUrlPlaceholder')}
            placeholderTextColor={currentTheme.textSecondary}
          />
          <TouchableOpacity
            style={[styles.button, {backgroundColor: currentTheme.primary}]}
            onPress={() => onSubmit(value)}>
            <Text
              style={[styles.buttonText, {color: currentTheme.textPrimary}]}>
              {t('settings.setupApiUrl')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: currentTheme.secondary}]}
            onPress={onPressLookup}>
            <Text
              style={[styles.buttonText, {color: currentTheme.textSecondary}]}>
              {t('settings.lookupApiUrl')}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default SettingApiSetupModal;
