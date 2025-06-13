import {Theme} from '@/types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface SettingButtonProps {
  title: string;
  theme: Theme;
  onPress: () => void;
}

function SettingButton({
  title,
  theme,
  onPress,
}: SettingButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: theme.primary}]}
      onPress={onPress}>
      <Text style={[styles.buttonText, {color: theme.textPrimary}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default SettingButton;
