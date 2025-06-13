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

interface SettingModalProps {
  visible: boolean;
  title: string;
  items: {
    key: string;
    name: string;
  }[];
  isDark: boolean;
  selectedKey: string | null;
  onPress: (key: string) => void;
  onClose: () => void;
}

function SettingModal({
  visible,
  title,
  items,
  selectedKey,
  isDark,
  onPress,
  onClose,
}: SettingModalProps) {
  const itemBackgroundColor = useMemo(() => {
    return isDark ? darkTheme.colors.background : lightTheme.colors.background;
  }, [isDark]);
  const itemTextColor = useMemo(() => {
    return isDark ? darkTheme.colors.text : lightTheme.colors.text;
  }, [isDark]);

  const MemorizedModal = useMemo(() => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.container}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <View style={styles.itemsContainer}>
              {items.map(item => {
                const isSelected = item.key === selectedKey;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => onPress(item.key)}
                    style={[
                      styles.item,
                      isSelected && {
                        backgroundColor: itemBackgroundColor,
                      },
                    ]}>
                    <Text style={[styles.itemText, {color: itemTextColor}]}>
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
  }, [
    itemBackgroundColor,
    itemTextColor,
    items,
    onClose,
    onPress,
    selectedKey,
    title,
    visible,
  ]);

  return MemorizedModal;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default SettingModal;
