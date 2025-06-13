/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import AppNavigator from './navigations/AppNavigator';

import './i18n';
import useAppStore from './store/appStore';
import i18n from './i18n';

function App(): React.JSX.Element {
  const {language} = useAppStore();
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <AppNavigator />;
}

export default App;
