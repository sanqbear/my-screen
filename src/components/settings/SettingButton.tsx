import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {darkTheme, lightTheme} from '@/types';

interface SettingButtonProps {
  title: string;
  isDark: boolean;
  onPress: () => void;
}

function SettingButton({
  title,
  isDark,
  onPress,
}: SettingButtonProps): React.JSX.Element {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: currentTheme.primary}]}
      onPress={onPress}>
      <Text style={[styles.buttonText, {color: currentTheme.textPrimary}]}>
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
