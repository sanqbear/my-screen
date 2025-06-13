import {Theme} from '@/types';
import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

interface SettingInformationRowProps {
  title: string;
  content: string;
  theme: Theme;
  onPress: () => void;
}

function SettingInformationRow({
  title,
  content,
  theme,
  onPress,
}: SettingInformationRowProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
      <Text style={[styles.content, {color: theme.text}]}>{content}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
  },
});

export default SettingInformationRow;
