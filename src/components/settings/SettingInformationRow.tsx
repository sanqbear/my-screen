import {darkTheme, lightTheme} from '@/types';
import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native';

interface SettingInformationRowProps {
  title: string;
  content: string;
  isDark: boolean;
  onPress: () => void;
}

function SettingInformationRow({
  title,
  content,
  isDark,
  onPress,
}: SettingInformationRowProps): React.JSX.Element {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.background,
          borderBottomColor: currentTheme.border,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <Text style={[styles.title, {color: currentTheme.text}]}>{title}</Text>
      <Text style={[styles.content, {color: currentTheme.text}]}>
        {content}
      </Text>
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
