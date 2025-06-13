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

interface SettingSelectModalProps {
  visible: boolean;
  title: string;
  items: {
    key: string;
    name: string;
  }[];
  isDark: boolean;
  selectedKey: string | null;
  onPressItem: (key: string) => void;
  onClose: () => void;
}

function SettingSelectModal({
  visible,
  title,
  items,
  selectedKey,
  isDark,
  onPressItem,
  onClose,
}: SettingSelectModalProps) {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

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
            {title}
          </Text>
          <View style={styles.itemsContainer}>
            {items.map(item => {
              const isSelected = item.key === selectedKey;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => onPressItem(item.key)}
                  style={[
                    styles.item,
                    isSelected && {
                      backgroundColor: currentTheme.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && {color: currentTheme.textPrimary},
                      !isSelected && {color: currentTheme.text},
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsContainer: {
    gap: 10,
  },
  item: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
});

export default SettingSelectModal;
