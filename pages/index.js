/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import AppBarTop from '../components/appbar';
import {withStyles} from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {I18nextProvider} from 'react-i18next';
import startI18n from '../tools/startI18n';
import {getTranslation} from '../tools/translationHelpers';
import IndexBody from '../components/indexbody';
// get language from query parameter or url path
const lang = 'fr';

class Index extends React.Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);

    this.i18n = startI18n(props.translations, 'fr');
  }

  static async getInitialProps({req}) {
    //console.log('index', stories);
    //console.log(stories);
    const translations = await getTranslation(
      lang,
      ['common', 'namespace1'],
      'http://localhost:4000/static/locales/',
    );
    return {translations};
  }

  render(props) {
    console.log('index', this.props.jobs);
    const i18n = this.props.i18n;
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <AppBarTop i18n={this.i18n} />
          <IndexBody i18n={this.i18n} jobs={[]} />
        </div>
      </I18nextProvider>
    );
  }
}

export default Index;
