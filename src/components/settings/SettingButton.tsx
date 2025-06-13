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
  const backgroundColor = useMemo(() => {
    return isDark ? darkTheme.background : lightTheme.background;
  }, [isDark]);

  const color = useMemo(() => {
    return isDark ? darkTheme.text : lightTheme.text;
  }, [isDark]);

  const MemorizedSettingButton = useMemo(() => {
    return (
      <TouchableOpacity
        style={[styles.button, {backgroundColor}]}
        onPress={onPress}>
        <Text style={[styles.buttonText, {color}]}>{title}</Text>
      </TouchableOpacity>
    );
  }, [backgroundColor, color, onPress, title]);

  return MemorizedSettingButton;
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
