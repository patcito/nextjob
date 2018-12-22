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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Router from 'next/router';
import {withRouter} from 'next/router';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
  root: {
    flexGrow: 1,
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

  constructor(props) {
    super(props);
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
    const isLoggedIn = this.props.userInfo && this.props.userInfo.userId;
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
                      's Job
                    </MenuItem>
                  </Link>
                </>
              ))}
            </Menu>
          </>
        ) : null}
      </div>
    );
  }
}

MenuList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuList);
