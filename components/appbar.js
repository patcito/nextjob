/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

import {withStyles} from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginAppBarTop from '../components/logintopbar';
import SearchFilters from '../components/search';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
});

// get language from query parameter or url path
const lang = 'fr';

class AppBarTop extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleChange = (event, value) => {
    this.setState({value});
  };

  handleDistanceChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleSwitchChange = name => event => {
    this.setState({[name]: event.target.checked});
  };

  constructor(props) {
    super(props);
  }

  render(props) {
    const {classes} = this.props;
    const {open} = this.state;
    const i18n = this.props.i18n;

    return (
      <AppBar position="static">
        <LoginAppBarTop
          i18n={i18n}
          userInfo={this.props.userInfo}
          companyCount={this.props.companyCount}
        />
        <SearchFilters
          i18n={i18n}
          group_by_location={this.props.group_by_location || []}
        />
      </AppBar>
    );
  }
}

AppBarTop.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBarTop);
