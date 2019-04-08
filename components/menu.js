/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
const grequest = require('graphql-request');
import {getHasuraHost} from '../lib/getHasuraHost';
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Router from 'next/router';
import {withRouter} from 'next/router';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import slugify from 'slugify';
import {
  TwitterCircle,
  GithubCircle,
  Medium,
  FacebookBox,
  Instagram,
} from 'mdi-material-ui';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  techLinks: {
    display: 'inline',
  },
  socialIcons: {
    marginRight: '5px',
    color: 'black !important',
    a: {
      color: 'black',
    },
  },
  drawer: {
    '@media (max-width: 992px)': {
      display: 'none',
    },
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

class MenuList extends React.Component {
  state = {
    open: false,
    email: ',',
    anchorEl: null,
    selectedIndex: 1,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClickListItem = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleMenuItemClick = (event, index) => {
    this.setState({selectedIndex: index, anchorEl: null});
  };

  handleCloseMenu = () => {
    this.setState({anchorEl: null});
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

  handleSaveNotifications = async () => {
    const {userInfo, userId, query} = this.props;
    const that = this;
    const queryOpts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
        mutation createNotifications($query: jsonb!, $userId: Int) {
          insert_SearchNotification(objects: {userId: $userId, query: $query}) {
            returning {
              query
            }
          }
        }
      `,
      headers: {
        'x-access-token': userInfo.token,
      },
    };
    const client = new grequest.GraphQLClient(queryOpts.uri, {
      headers: queryOpts.headers,
    });
    console.log('NOOOOOOOO', userInfo, userId);
    let user = await client
      .request(queryOpts.query, {
        userId: userInfo.userId,
        query: query,
      })
      .then(() => {
        that.setState({openNotification: true});
      });
  };

  constructor(props) {
    super(props);
  }

  componentDidMount(props) {
    console.log(this.props.userInfo);
    if (
      this.props.userInfo &&
      this.props.userInfo.userId &&
      this.props.userInfo.githubEmail &&
      this.props.userInfo.githubEmail.indexOf &&
      this.props.userInfo.githubEmail.indexOf('@') !== -1
    ) {
      this.setState({email: this.props.userInfo.githubEmail});
      console.log('email', this.props.userInfo.githubEmail);
    } else if (
      this.props.userInfo &&
      this.props.userInfo.currentUser &&
      this.props.userInfo.currentUser.githubEmail &&
      this.props.userInfo.currentUser.githubEmail.indexOf &&
      this.props.userInfo.currentUser.githubEmail.indexOf('@') !== -1
    ) {
      this.setState({email: this.props.userInfo.currentUser.githubEmail});
      console.log('email', this.props.userInfo.currentUser.githubEmail);
    }
  }

  render(props) {
    const {classes} = this.props;
    let companyCount = this.props.companyCount;
    if (!companyCount) {
      companyCount = {nodes: []};
    }
    const {anchorEl} = this.state;
    const {open} = this.state;
    const i18n = this.props.i18n;
    const showNotifications = this.props.showNotifications;
    const isLoggedIn = this.props.userInfo && this.props.userInfo.userId;
    console.log('shownotification', showNotifications);
    console.log('email', this.state.email);
    return (
      <div className={classes.root}>
        <List
          component="nav"
          className={this.props.drawer ? null : classes.drawer}>
          {(Router.router &&
            Router.router.route &&
            Router.router.route !== '/') ||
          this.props.me ? (
            <Link href="/">
              <ListItem button>
                <ListItemIcon>
                  <ViewHeadlineIcon />
                </ListItemIcon>
                <ListItemText primary={i18n.t('Latest jobs')} />
              </ListItem>
            </Link>
          ) : null}

          <Link href="/companies">
            <ListItem button>
              <ListItemIcon>
                <BusinessCenterIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.t('Companies')} />
            </ListItem>
          </Link>
        </List>
        {isLoggedIn ? (
          <>
            <Divider className={this.props.drawer ? null : classes.drawer} />
            <List
              component="nav"
              className={this.props.drawer ? null : classes.drawer}>
              <Link href="/applications" prefetch>
                <ListItem button>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={i18n.t('Applications')} />
                </ListItem>
              </Link>
              {this.props.userInfo.linkedin ? (
                <ListItem button onClick={this.handleClickListItem}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={i18n.t('My Company Details')} />
                </ListItem>
              ) : null}
            </List>
            {/*`*/}
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleCloseMenu}>
              {companyCount.nodes.map((company, index) => (
                <>
                  <Link href={'/companies/' + company.id}>
                    <MenuItem
                      key={company.id}
                      onClick={event => this.handleMenuItemClick(event, index)}>
                      {company.name}
                      's Profile
                    </MenuItem>
                  </Link>
                  <Link href={'/companies/' + company.id + '/edit'}>
                    <MenuItem
                      key={company.id}
                      onClick={event => this.handleMenuItemClick(event, index)}>
                      Edit {company.name}
                      's Profile
                    </MenuItem>
                  </Link>
                  <Link href={'/jobs/companies/' + company.id + '/team'}>
                    <MenuItem
                      key={company.id}
                      onClick={event => this.handleMenuItemClick(event, index)}>
                      {company.name}
                      's Jobs
                    </MenuItem>
                  </Link>
                </>
              ))}
            </Menu>
          </>
        ) : null}
        {this.props.showNotifications &&
        this.state.email.indexOf('@') !== -1 ? (
          <List
            component="nav"
            className={this.props.drawer ? null : classes.drawer}>
            <ListItem style={{backgroundColor: '#fff'}}>
              <>
                <Divider
                  className={this.props.drawer ? null : classes.drawer}
                />
                <FormControl
                  className={classes.formControl}
                  error={this.state.emailvalid === false}>
                  <TextField
                    label="Email"
                    name="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                    id="email"
                  />
                  <FormHelperText
                    id={
                      this.state.emailvalid !== false
                        ? 'email-helper-text'
                        : 'email-error-text'
                    }>
                    {i18n.t(
                      'Get notifications when new jobs fitting this search are posted',
                    )}
                  </FormHelperText>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSaveNotifications}
                    className={classes.button}>
                    {i18n.t('Save')}
                  </Button>
                </FormControl>
              </>
            </ListItem>
          </List>
        ) : null}
        {this.props.searchNotification ? (
          <List
            component="nav"
            className={this.props.drawer ? null : classes.drawer}>
            <ListItem style={{backgroundColor: '#fff'}}>
              <>
                <Divider
                  className={this.props.drawer ? null : classes.drawer}
                />
                <List>
                  <ListItem>
                    <ListItemText
                      variant="h6"
                      gutterBottom
                      primary="Saved search"
                    />
                  </ListItem>
                  {this.props.searchNotification.map(s => (
                    <a
                      href={
                        '/?' +
                        Object.entries(s.query)
                          .map(([key, val]) => `${key}=${val}`)
                          .join('&')
                      }>
                      <ListItem>
                        <ListItemText
                          primary={
                            (s.query.Skill ? s.query.Skill + ' ' : '') +
                            (s.query.jobEmployementType
                              ? s.query.jobEmployementType + ' '
                              : '') +
                            (s.query.description
                              ? s.query.description + ' '
                              : '') +
                            (s.query.locality
                              ? '@' + s.query.locality + ', ' + s.query.country
                              : '')
                          }
                        />
                      </ListItem>
                    </a>
                  ))}
                </List>
              </>
            </ListItem>
          </List>
        ) : null}
        <Divider className={this.props.drawer ? null : classes.drawer} />
        <List
          component="nav"
          className={this.props.drawer ? null : classes.drawer}>
          <ListItem style={{backgroundColor: '#e0e0e0'}}>
            <strong>
              <p>
                Post a react job or apply for
                <br /> one for free!
              </p>
              <p>
                Reach thousands of passionate
                <br /> React developers today <br />
                visiting our conference site <br />
                and social media accounts.
              </p>
            </strong>
          </ListItem>
          <ListItem>
            <span>
              <a href="https://github.com/patcito/nextjob" target="_blank">
                Made
              </a>{' '}
              with 💖 using{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                className="techLinks">
                Next.js
              </a>
              ,<br />
              <a
                href="https://material-ui.com/"
                target="_blank"
                className="techLinks">
                MaterialUI
              </a>{' '}
              and{' '}
              <a
                href="https://hasura.io/"
                target="_blank"
                className="techLinks">
                Hasura
              </a>
            </span>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <a
                className={classes.socialIcons}
                href="https://github.com/patcito/nextjob"
                target="_blank"
                button>
                <GithubCircle />
              </a>
              <a
                className={classes.socialIcons}
                href="https://twitter.com/ReactEurope"
                target="_blank">
                <TwitterCircle />
              </a>
              <a
                className={classes.socialIcons}
                href="https://medium.com/@ReactEurope"
                target="_blank">
                <Medium />
              </a>
              <a
                className={classes.socialIcons}
                href="https://www.facebook.com/ReactEurope"
                target="_blank">
                <FacebookBox />
              </a>
            </ListItemIcon>
          </ListItem>
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.openNotification}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({openNotification: false});
          }}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id="message-id">{i18n.t('Search notification saved')}</span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={styles.close}
              onClick={() => {
                this.setState({openNotification: false});
              }}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}
MenuList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuList);
