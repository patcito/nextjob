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
import SearchFilters from '../components/search';

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

class LoginAppBarTop extends React.Component {
  state = {};

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

  handleLogoutClick = () => {
    this.setState({token: false, currentUser: null, loggedOut: true});
    localStorage.clear();
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  };

  constructor(props) {
    super(props);
    const that = this;
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.search
    ) {
      if (props.token && props.currentUser) {
        this.setState({
          currentUser: props.userInfo.currentUser,
          token: props.userInfo.token,
        });
        localStorage.setItem('token', props.userInfo.token);
        document.cookie = 'token=' + props.userInfo.token;
        localStorage.setItem(
          'currentUser',
          JSON.stringify(props.userInfo.currentUser),
        );
      }
    }
  }

  componentDidMount(props) {
    console.log('props', this.props);
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('currentUser');
      if (token && typeof user !== 'undefined') {
        this.setState({
          currentUser: JSON.parse(localStorage.getItem('currentUser')),
          token: localStorage.getItem('token'),
        });
      } else if (this.props.userInfo.token && this.props.userInfo.currentUser) {
        this.setState({
          currentUser: this.props.userInfo.currentUser,
          token: this.props.userInfo.token,
        });
        localStorage.setItem('token', this.props.userInfo.token);
        document.cookie = 'token=' + this.props.userInfo.token;
        localStorage.setItem(
          'currentUser',
          JSON.stringify(this.props.userInfo.currentUser),
        );
      }
    }
  }

  render(props) {
    const isLoggedIn = this.props.userInfo
      ? (this.props.userInfo.github || this.props.userInfo.linkedin) &&
        !this.state.loggedOut
      : false;
    console.log('userinfo', this.props.userInfo);
    const isRecruiter =
      this.state.currentUser && this.state.currentUser.recruiter;
    const {classes} = this.props;
    const {open} = this.state;
    const i18n = this.props.i18n;
    return (
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Link href="/">
          <Typography
            variant="title"
            color="inherit"
            className={classes.flex}
            style={{cursor: 'pointer'}}>
            ReactEurope Jobs
          </Typography>
        </Link>
        {!isLoggedIn || this.props.userInfo.linkedin ? (
          <Link href="/newjob">
            <Button
              variant="contained"
              color="secondary"
              style={{color: '#FFF', marginLeft: '15px'}}>
              {i18n.t('Post a job')}
            </Button>
          </Link>
        ) : null}
        <Button
          variant="contained"
          style={{
            marginLeft: '15px',
            backgroundColor: '#f50057',
            color: '#FFF',
          }}>
          {i18n.t('Latest jobs')}
        </Button>
        {isLoggedIn ? (
          <Button color="inherit" onClick={this.handleLogoutClick}>
            Logout
          </Button>
        ) : (
          <>
            <a href="https://github.com/login/oauth/authorize?client_id=e11e3938d18bb98dda68&scope=user">
              <Button color="inherit">Login with Github</Button>
            </a>
            <a href="https://www.linkedin.com/oauth/v2/authorization?client_id=86in1o0kvqc348&response_type=code&redirect_uri=http://localhost:4000&scope=r_basicprofile%20r_emailaddress">
              <Button color="inherit">Login with Linkedin</Button>
            </a>
          </>
        )}
      </Toolbar>
    );
  }
}

LoginAppBarTop.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginAppBarTop);
