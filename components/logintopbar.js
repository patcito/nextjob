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
    this.setState({token: false, currentUser: null});
    localStorage.clear();
  };

  constructor(props) {
    super(props);
    const that = this;
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.search
    ) {
      const currentUser =
        localStorage.getItem('currentUser') === null
          ? false
          : JSON.parse(localStorage.getItem('currentUser'));

      if (!currentUser) {
        const ocode = window.location.search
          .substring(1)
          .split('&')[0]
          .split('code=')[1];
        if (ocode) {
          // call Graphcool authenticateGithubUser mutation
          (async () => {
            const rawResponse = await fetch('/auth', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ocode: ocode}),
            });
            const content = await rawResponse.json();
            localStorage.setItem('token', content.token);
            localStorage.setItem('currentUser', JSON.stringify(content.user));
            this.setState({
              token: content.token,
              currentUser: content.user,
            });
          })();
        }
      } else {
        this.setState({
          currentUser: currentUser,
          token: localStorage.getItem('token'),
        });
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
        (async () => {
          const rawResponse = await fetch('/checksession', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          });
          const content = await rawResponse.json();
          if (content !== 'ok') {
            this.setState({
              currentUser: null,
              token: null,
            });
            localStorage.clear();
          }
        })();
      }
    }
  }

  render(props) {
    const isLoggedIn = this.state.token;
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
        {!isLoggedIn ||
        (this.state.currentUser && this.state.currentUser.linkedinEmail) ? (
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
        {this.state.token ? (
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
