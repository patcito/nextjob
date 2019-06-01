/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '../components/menu';
import MenuIcon from '@material-ui/icons/Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import pink from '@material-ui/core/colors/pink';
import Link from 'next/link';
import Drawer from '@material-ui/core/Drawer';
import Router from 'next/router';
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();

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
    color: '#FFF',
  },
  button: {
    margin: theme.spacing.unit,
  },
  offersButton: {
    backgroundColor: pink[500],
  },
  showOnMobile: {
    '@media (min-width: 728px)': {
      display: 'none',
    },
  },
  hideOnMobile: {
    '@media (max-width: 728px)': {
      display: 'none',
    },
  },
});

class LoginAppBarTop extends React.Component {
  state = {};

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
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

  logOut = () => {
    this.setState({token: false, currentUser: null, loggedOut: true});
    localStorage.clear();
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  };
  handleLogoutClick = () => {
    this.logOut();
    Router.push('/');
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
        localStorage.setItem('userInfo', JSON.stringify(props.userInfo));
        document.cookie = 'token=' + props.userInfo.token;
        localStorage.setItem(
          'currentUser',
          JSON.stringify(props.userInfo.currentUser),
        );
      }
    }
  }

  componentDidMount(props) {
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
        localStorage.setItem('userInfo', JSON.stringify(this.props.userInfo));
        document.cookie = 'token=' + this.props.userInfo.token;
        localStorage.setItem(
          'currentUser',
          JSON.stringify(this.props.userInfo.currentUser),
        );
      }
      if (
        !this.props.userInfo ||
        this.props.userInfo.userId === null ||
        JSON.parse(localStorage.getItem('currentUser')) === null
      ) {
        this.logOut();
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
    console.log('propss', this.props.userInfo);
    const {open} = this.state;
    const i18n = this.props.i18n;
    const ApplicantLoginLink = () => (
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${
          publicRuntimeConfig.githubId
        }&scope=public_repo%20user:email`}>
        {i18n.t('common:Login as Talent')}
      </a>
    );
    return (
      <>
        <Toolbar>
          <IconButton
            onClick={this.toggleDrawer}
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
              style={{cursor: 'pointer', color: 'white'}}>
              ReactEurope Jobs
            </Typography>
          </Link>
          {isLoggedIn && this.props.userInfo.github ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              href="/profile"
              style={{color: '#FFF', marginLeft: '15px'}}>
              {i18n.t('My Profile')}
            </Button>
          ) : null}
          {isLoggedIn && this.props.userInfo.linkedin ? (
            <Button
              href="/newjob"
              variant="contained"
              color="secondary"
              className={classes.hideOnMobile}
              style={{color: '#FFF', marginLeft: '15px'}}>
              {i18n.t('Post a job')}
            </Button>
          ) : null}
          <Button
            className={classes.hideOnMobile}
            variant="contained"
            href="/"
            style={{
              marginLeft: '15px',
              backgroundColor: '#f50057',
              color: '#FFF',
            }}>
            {i18n.t('Latest jobs')}
          </Button>
          {isLoggedIn ? (
            <Button color="inherit" onClick={this.handleLogoutClick}>
              {i18n.t('Logout')}
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                style={{color: 'white'}}
                href={`https://github.com/login/oauth/authorize?client_id=${
                  publicRuntimeConfig.githubId
                }&scope=public_repo%20user:email`}>
                {i18n.t('common:Login as Talent')}
              </Button>

              <Button
                color="inherit"
                className={classes.hideOnMobile}
                style={{color: 'white'}}
                href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
                  publicRuntimeConfig.linkedinId
                }&redirect_uri=${
                  publicRuntimeConfig.publicHostname
                }&state=fooobar&scope=r_liteprofile%20r_emailaddress`}>
                {i18n.t('common:Login as Employer')}
              </Button>
              <Button
                color="inherit"
                className={classes.showOnMobile}
                style={{color: 'white'}}
                href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
                  publicRuntimeConfig.linkedinId
                }&redirect_uri=${
                  publicRuntimeConfig.publicHostname
                }&state=fooobar&scope=r_liteprofile%20r_emailaddress`}>
                {i18n.t('common:Login as Employer')}
              </Button>
            </>
          )}
        </Toolbar>
        <Drawer open={this.state.open} onClose={this.toggleDrawer}>
          <MenuList
            i18n={i18n}
            userInfo={this.props.userInfo}
            drawer={true}
            companyCount={this.props.companyCount}
          />
        </Drawer>
      </>
    );
  }
}

LoginAppBarTop.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginAppBarTop);
