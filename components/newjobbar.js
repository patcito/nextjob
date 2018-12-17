/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import pink from '@material-ui/core/colors/pink';
import Link from 'next/link';
import LoginAppBarTop from '../components/logintopbar';

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
  button: {
    margin: theme.spacing.unit,
  },
  offersButton: {
    backgroundColor: pink[500],
  },
});

// get language from query parameter or url path
const lang = 'fr';

class SlimAppBarTop extends React.Component {
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
      </AppBar>
    );
  }
}

SlimAppBarTop.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SlimAppBarTop);
