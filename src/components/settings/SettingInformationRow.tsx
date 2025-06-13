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
  const color = useMemo(() => {
    return isDark ? darkTheme.colors.text : lightTheme.colors.text;
  }, [isDark]);

  const backgroundColor = useMemo(() => {
    return isDark ? darkTheme.colors.background : lightTheme.colors.background;
  }, [isDark]);

  const borderBottomColor = useMemo(() => {
    return isDark ? darkTheme.colors.border : lightTheme.colors.border;
  }, [isDark]);

  const MemorizedSettingInformationRow = useMemo(() => {
    return (
      <TouchableOpacity
        style={[styles.container, {backgroundColor, borderBottomColor}]}
        onPress={onPress}
        disabled={!onPress}>
        <Text style={[styles.title, {color}]}>{title}</Text>
        <Text style={[styles.content, {color}]}>{content}</Text>
      </TouchableOpacity>
    );
  }, [backgroundColor, borderBottomColor, onPress, color, title, content]);

  return MemorizedSettingInformationRow;
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
