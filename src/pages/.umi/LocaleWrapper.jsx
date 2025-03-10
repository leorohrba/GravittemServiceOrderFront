import React from 'react';
import {
  _setIntlObject,
  addLocaleData,
  IntlProvider,
  intlShape,
  LangContext,
  _setLocaleContext
} from 'umi-plugin-locale/lib/locale';

const InjectedWrapper = (() => {
  let sfc = (props, context) => {
    _setIntlObject(context.intl);
    return props.children;
  };
  sfc.contextTypes = {
    intl: intlShape,
  };
  return sfc;
})();

import 'moment/locale/pt-br';

const baseNavigator = true;
const baseSeparator = '-';
const useLocalStorage = true;

import { LocaleProvider, version } from 'antd';
import moment from 'moment';
import 'moment/locale/pt-br';
let defaultAntd = require('antd/es/locale-provider/pt_BR');
defaultAntd = defaultAntd.default || defaultAntd;

const localeInfo = {
  'en-US': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('/home/leo/Desktop/work/dashboard/GravittemServiceOrderFront/src/locales/en-US.js')),
    },
    locale: 'en-US',
    antd: require('antd/es/locale-provider/en_US'),
    data: require('react-intl/locale-data/en'),
    momentLocale: '',
  },
  'pt-BR': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('/home/leo/Desktop/work/dashboard/GravittemServiceOrderFront/src/locales/pt-BR.js')),
    },
    locale: 'pt-BR',
    antd: require('antd/es/locale-provider/pt_BR'),
    data: require('react-intl/locale-data/pt'),
    momentLocale: 'pt-br',
  },
};

class LocaleWrapper extends React.Component{
  state = {
    locale: 'pt-BR',
  };
  getAppLocale(){
    let appLocale = {
      locale: 'pt-BR',
      messages: {},
      data: require('react-intl/locale-data/pt'),
      momentLocale: 'pt-br',
    };

    const runtimeLocale = require('umi/_runtimePlugin').mergeConfig('locale') || {};
    const runtimeLocaleDefault =  typeof runtimeLocale.default === 'function' ? runtimeLocale.default() : runtimeLocale.default;
    if (
      useLocalStorage
      && typeof localStorage !== 'undefined'
      && localStorage.getItem('umi_locale')
      && localeInfo[localStorage.getItem('umi_locale')]
    ) {
      appLocale = localeInfo[localStorage.getItem('umi_locale')];
    } else if (
      typeof navigator !== 'undefined'
      && localeInfo[navigator.language]
      && baseNavigator
    ) {
      appLocale = localeInfo[navigator.language];
    } else if(localeInfo[runtimeLocaleDefault]){
      appLocale = localeInfo[runtimeLocaleDefault];
    } else {
      appLocale = localeInfo['pt-BR'] || appLocale;
    }
    window.g_lang = appLocale.locale;
    window.g_langSeparator = baseSeparator || '-';
    appLocale.data && addLocaleData(appLocale.data);

    // support dynamic add messages for umi ui
    // { 'zh-CN': { key: value }, 'en-US': { key: value } }
    const runtimeLocaleMessagesType = typeof runtimeLocale.messages;
    if (runtimeLocaleMessagesType === 'object' || runtimeLocaleMessagesType === 'function') {
      const runtimeMessage = runtimeLocaleMessagesType === 'object'
        ? runtimeLocale.messages[appLocale.locale]
        : runtimeLocale.messages()[appLocale.locale];
      Object.assign(appLocale.messages, runtimeMessage || {});
    }

    return appLocale;
  }
  reloadAppLocale = () => {
    const appLocale = this.getAppLocale();
    this.setState({
      locale: appLocale.locale,
    });
  };

  render(){
    const appLocale = this.getAppLocale();
    // react-intl must use `-` separator
    const reactIntlLocale = appLocale.locale.split(baseSeparator).join('-');
    const LangContextValue = {
      locale: reactIntlLocale,
      reloadAppLocale: this.reloadAppLocale,
    };
    let ret = this.props.children;
    ret = (<IntlProvider locale={reactIntlLocale} messages={appLocale.messages}>
      <InjectedWrapper>
        <LangContext.Provider value={LangContextValue}>
          <LangContext.Consumer>{(value) => {
            _setLocaleContext(value);
            return this.props.children
            }}</LangContext.Consumer>
        </LangContext.Provider>
      </InjectedWrapper>
    </IntlProvider>)
     // avoid antd ConfigProvider not found
     let AntdProvider = LocaleProvider;
     const [major, minor] = `${version || ''}`.split('.');
     // antd 3.21.0 use ConfigProvider not LocaleProvider
     const isConfigProvider = Number(major) > 3 || (Number(major) >= 3 && Number(minor) >= 21);
     if (isConfigProvider) {
       try {
         AntdProvider = require('antd/es/config-provider').default;
       } catch (e) {}
     }

     return (<AntdProvider locale={appLocale.antd ? (appLocale.antd.default || appLocale.antd) : defaultAntd}>
      {ret}
    </AntdProvider>);
    return ret;
  }
}
export default LocaleWrapper;
