/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
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

class IndexJobs extends React.Component {
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
    const {page, url, jobs, query} = this.props;
    return (
      <>
        {jobs.map((job, i) => (
          <Job key={job.id} i18n={i18n} query={query} job={job} i={i} />
        ))}
      </>
    );
  }
}

export default withStyles(styles)(IndexJobs);
