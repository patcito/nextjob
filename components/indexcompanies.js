/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Company from '../components/company';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

// get language from query parameter or url path
const lang = 'fr';

class IndexCompanies extends React.Component {
  constructor(props) {
    super(props);
    const jobs = this.props.jobs;
  }
  state = {
    isSignedIn: false,
    userProfile: null,
    someCollection: {},
    someDocument: null,
  };

  componentDidMount() {}
  componentWillUnmount() {}
  render(props) {
    const i18n = this.props.i18n;
    const {page, url, companies, query} = this.props;
    return (
      <Grid container spacing={24}>
        {companies.map(company => (
          <Grid key={company.id} item xs={12} md={6}>
            <Company
              key={company.id}
              query={query}
              i18n={i18n}
              company={company}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(IndexCompanies);
