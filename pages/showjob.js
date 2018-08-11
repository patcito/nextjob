/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import NewJobBar from '../components/newjobbar';
import {withStyles} from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from '@material-ui/core/Grid';
import {Parallax} from 'react-parallax';

import {I18nextProvider} from 'react-i18next';
import startI18n from '../tools/startI18n';
import {getTranslation} from '../tools/translationHelpers';
import IndexBody from '../components/indexbody';
// get language from query parameter or url path
const lang = 'fr';

class NewJob extends React.Component {
  state = {
    open: false,
  };
  static async getInitialProps() {
    const translations = await getTranslation(
      lang,
      ['common', 'namespace1'],
      'http://localhost:4000/static/locales/',
    );

    return {translations};
  }

  constructor(props) {
    super(props);

    this.i18n = startI18n(props.translations, lang);
  }

  render(props) {
    const image1 =
      'https://images.unsplash.com/photo-1498092651296-641e88c3b057?auto=format&fit=crop&w=1778&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D';

    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <NewJobBar i18n={this.i18n} />
        <h1>Hello You!</h1>
          <Parallax bgImage={image1} strength={500}>
            <Grid container spacing={24}>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
              <Grid item xs={12} md={8}>
                lol
              </Grid>
            </Grid>
          </Parallax>
          <Grid container spacing={24}>
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>{' '}
            <Grid item xs={12} md={8}>
              caaa
            </Grid>
          </Grid>
        </div>
      </I18nextProvider>
    );
  }
}

export default NewJob;
