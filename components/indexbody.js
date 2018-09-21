/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuList from '../components/menu';
import Job from '../components/job';

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
});

// get language from query parameter or url path
const lang = 'fr';

class IndexBody extends React.Component {
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
    const {page, url, jobs} = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} md={3}>
          <MenuList i18n={i18n} />
        </Grid>
        <Grid item xs={12} md={8}>
          <div>
            {jobs.Job.map(job => (
              <Job key={job.id} i18n={i18n} job={job} />
            ))}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(IndexBody);
