import {Theme} from '@/types';
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
  theme: Theme;
  selectedKey: string | null;
  onPressItem: (key: string) => void;
  onClose: () => void;
}

function SettingSelectModal({
  visible,
  title,
  items,
  selectedKey,
  theme,
  onPressItem,
  onClose,
}: SettingSelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={[styles.overlay, {backgroundColor: theme.cardOverlay}]}
        onPress={onClose}>
        <View style={[styles.container, {backgroundColor: theme.card}]}>
          <Text numberOfLines={1} style={[styles.title, {color: theme.text}]}>
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
                      backgroundColor: theme.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && {color: theme.textPrimary},
                      !isSelected && {color: theme.text},
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
