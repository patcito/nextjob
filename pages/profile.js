/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import AppBarTop from '../components/appbar';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();

import NewJobBar from '../components/newjobbar';
import {withStyles} from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from '@material-ui/core/Grid';
import {Parallax} from 'react-parallax';

import {I18nextProvider} from 'react-i18next';
import startI18n from '../tools/startI18n';
import {getTranslation} from '../tools/translationHelpers';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '../components/menu';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

import SingleSelect from '../components/select';
import DownshiftSelect from '../components/downshift';
import MultipleDownshiftSelect from '../components/multipledownshift';

import Router from 'next/router';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import PlaceIcon from '@material-ui/icons/Place';
import LaptopIcon from '@material-ui/icons/Laptop';
import LinkIcon from '@material-ui/icons/Link';
import PeopleIcon from '@material-ui/icons/People';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import WorkIcon from '@material-ui/icons/Work';
import HistoryIcon from '@material-ui/icons/History';
import Link from 'next/link';

import Cookies from 'js-cookie';

import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import ReactPlayer from 'react-player';
import ReactTimeout from 'react-timeout';
import PERKS from '../data/perks';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import {
  TwitterCircle,
  GithubCircle,
  SourceMerge,
  OpenInNew,
} from 'mdi-material-ui';
import {withRouter} from 'next/router';
import Slider, {Range} from 'rc-slider';
import Tooltip from 'rc-tooltip';
import CardHeader from '@material-ui/core/CardHeader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import 'rc-slider/assets/index.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const TooltipRange = createSliderWithTooltip(Range);

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  card: {
    width: '100%',
    marginTop: 10,
    marginRight: 10,
  },

  cardActionArea: {
    width: '100%',
  },
  media: {
    width: '100%',
  },
  avatar: {
    pointer: 'cursor',
  },
  iconButton: {
    fontSize: '14px',
    width: '25%',
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'auto',
    },
  },
  headerIcons: {
    marginRight: '5px',
  },
  chiptags: {
    color: '#fff',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
  },
  chip: {
    marginRight: 10,
  },
});

class Profile extends React.Component {
  state = {
    open: false,
    skills: [],
    industry: {},
    moderators: [],
    company: {
      yearFounded: 2006,
      url: '',
      name: '',
      employeeCount: 5,
      devCount: 5,
      id: 0,
      description: '',
      employee1: {
        name: '',
        title: '',
        bio: '',
        twitter: '',
        github: '',
        published: false,
      },
      employee2: {
        name: '',
        title: '',
        bio: '',
        twitter: '',
        github: '',
        published: false,
      },
      media1: {url: '', published: false},
      media2: {url: '', published: false},
      media3: {url: '', published: false},
    },
  };
  handleBlurIndustry = (value, required) => {
    this.setState({
      industryvalid: value || !required ? true : false,
    });
  };

  static async getInitialProps({req, query}) {
    let lang = '';
    if (req && req.locale && req.locale.language) {
      lang = req.locale.language;
    } else if (window && window.navigator && window.navigator.language) {
      lang = window.navigator.language.split('-')[0];
    }
    if (lang !== 'en' && lang !== 'fr') {
      lang = 'en';
    }

    const translations = await getTranslation(
      lang,
      [
        'common',
        'namespace1',
        'industries',
        'newjob',
        'jobstitles',
        'jobfunctions',
        'employementtypes',
        'senioritylevels',
      ],
      'http://localhost:4000/static/locales/',
    );
    let userInfo = {};
    let token = null;
    let userId = null;
    let github = false;
    let linkedin = false;
    if (req) {
      console.log('req!', req.userId);
      req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      github = req.github;
      linkedin = req.linkedin;
      userInfo = {
        userId: userId,
        token: token,
        github: github,
        linkedin: linkedin,
        currentUser: req.currentUser,
      };
    } else {
      token = localStorage.getItem('token');
      localStorage.getItem('currentUser')
        ? (userId = JSON.parse(localStorage.getItem('currentUser')).id)
        : (userId = null);
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
    const queryOpts = {
      uri: publicRuntimeConfig.hasura,
      json: true,
      query: `query User($id: Int!){
  						User(where: {id: {_eq: $id}}) {
						  id
						  githubEmail
                          githubAvatarUrl
                          githubUsername
                          linkedinEmail
                          linkedinProfile
                          bio
                          githubBlogUrl
                          firstName
                          lastName
						  name
                          pullRequests
                          githubRepositories
						  Companies {
							id
							name
							description
							url
							Industry
							yearFounded
						  }
						}
						}`,
      headers: {
        'x-access-token': userInfo.token,
      },
    };
    const client = new grequest.GraphQLClient(queryOpts.uri, {
      headers: queryOpts.headers,
    });
    if (query && query.userProfileId && query.userProfileId !== null) {
      userId = query.userProfileId;
    }
    let user = await client.request(queryOpts.query, {
      id: userId,
    });

    if (user.User.length > 0) {
      user = user.User[0];
    } else {
      user = null;
    }
    const isCurrentUserProfile = user.id === userInfo.userId;
    return {translations, userId, userInfo, user, isCurrentUserProfile};
  }
  constructor(props) {
    super(props);
    this.i18n = startI18n(props.translations, this.props.lang);
    this.PERKS = PERKS.map(suggestion => ({
      value: suggestion.title,
      label: suggestion.title,
    }));
  }

  componentDidMount(props) {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
      let token = localStorage.getItem('token');
      localStorage.getItem('currentUser')
        ? (user = JSON.parse(localStorage.getItem('currentUser')))
        : (user = null);
    }
  }
  render(props) {
    const {classes, user} = this.props;
    const i18n = this.i18n;
    const {open} = this.state;
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <NewJobBar i18n={this.i18n} userInfo={this.props.userInfo} />
          <Grid container spacing={24}>
            <Grid item xs={12} md={3}>
              <MenuList i18n={i18n} userInfo={this.props.userInfo} />
            </Grid>
            <Grid item xs={12} md={6}>
              <div style={{background: 'white'}}>
                <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <Avatar
                        aria-label={user.name}
                        src={user.githubAvatarUrl}
                        className={classes.avatar}
                      />
                    }
                    title={
                      <Typography gutterBottom variant="h3" component="h1">
                        {user.name}
                      </Typography>
                    }
                    subheader={
                      user.bio ? (
                        <>
                          {user.bio}
                          <a href={user.githubBlogUrl} target="_blank">
                            {user.githubBlogUrl}
                          </a>
                        </>
                      ) : null
                    }
                  />
                  <CardActionArea className={classes.cardActionArea}>
                    <CardMedia
                      className={classes.media}
                      title={user.name}
                      subheader={
                        <>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Delete">
                            <PlaceIcon className={classes.headerIcons} />{' '}
                            <a
                              href={
                                'https://www.google.com/maps/search/' +
                                this.state.currentAddressDescription
                              }
                              style={{color: 'rgba(0, 0, 0, 0.54)'}}
                              target="_blank">
                              lol
                            </a>
                          </IconButton>
                          <a href={user.name} target="_blank">
                            <IconButton
                              disableRipple={true}
                              disableFocusRipple={true}
                              className={classes.iconButton}
                              aria-label="Delete"
                              style={{cursor: 'pointer'}}
                            />
                          </a>
                        </>
                      }
                    />
                  </CardActionArea>
                </Card>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography
                      variant="h4"
                      gutterBottom
                      className={classes.title}>
                      Positions
                    </Typography>
                    {user.linkedinProfile && user.linkedinProfile.positions ? (
                      user.linkedinProfile.positions.values.map(position => (
                        <List key={position.title} dense={true}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <>
                                  {position.title} @ {position.company.name}
                                </>
                              }
                              secondary={
                                <>
                                  from {position.startDate.month}/
                                  {position.startDate.year}
                                  {position.isCurrent
                                    ? ' to present'
                                    : 'until ' +
                                      position.endDate.month +
                                      '/' +
                                      position.endDate.year}
                                </>
                              }
                            />
                          </ListItem>
                        </List>
                      ))
                    ) : (
                      <>
                        {this.props.isCurrentUserProfile ? (
                          <CardActions>
                            <a href="https://www.linkedin.com/oauth/v2/authorization?client_id=86in1o0kvqc348&response_type=code&redirect_uri=http://localhost:4000&scope=r_basicprofile%20r_emailaddress">
                              Connect to linkedin to fill your positions
                              automatically
                            </a>
                          </CardActions>
                        ) : (
                          'This user has not filled their profile yet.'
                        )}
                      </>
                    )}
                    <Typography
                      variant="h4"
                      gutterBottom
                      className={classes.title}>
                      Open Source Contributions
                    </Typography>
                    <Typography
                      variant="p"
                      component="p"
                      className={classes.title}>
                      Keep in mind that any lack of open source contributions
                      does not mean lack of skills and that all candidates
                      should be investigated further based on other factors such
                      as previous positions and education.
                    </Typography>
                    <p />
                    {user.githubRepositories &&
                    user.githubRepositories.nodes &&
                    user.githubRepositories.nodes.length > 0 ? (
                      <>
                        <Typography
                          variant="h4"
                          gutterBottom
                          className={classes.title}>
                          Repositories contributed to
                        </Typography>
                        {user.githubRepositories.nodes.map(repo => (
                          <>
                            <List key={repo.nameWithOwner} dense={true}>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar src={repo.owner.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <>
                                      [{repo.primaryLanguage.name}]{' '}
                                      {repo.nameWithOwner} (
                                      {repo.stargazers.totalCount} ⭐'s)
                                    </>
                                  }
                                  secondary={repo.description}
                                />
                                <ListItemSecondaryAction>
                                  <a
                                    href={
                                      repo.url +
                                      '/commits?author=' +
                                      user.githubUsername
                                    }
                                    target="_blank">
                                    <IconButton aria-label="Delete">
                                      <OpenInNew />
                                    </IconButton>
                                  </a>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </List>
                          </>
                        ))}
                      </>
                    ) : null}
                    {user.pullRequests &&
                    user.pullRequests.nodes &&
                    user.pullRequests.nodes.length > 0 ? (
                      <>
                        <Typography
                          variant="h4"
                          gutterBottom
                          className={classes.title}>
                          Merged Pull Requests
                        </Typography>
                        {user.pullRequests.nodes.map(pr => (
                          <>
                            <List key={pr.id} dense={true}>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar src={pr.repository.owner.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <>
                                      {pr.repository.primaryLanguage ? (
                                        <>
                                          [{pr.repository.primaryLanguage.name}]{' '}
                                        </>
                                      ) : null}
                                      {pr.title} merged in{' '}
                                      {pr.repository.nameWithOwner}
                                    </>
                                  }
                                  secondary={
                                    pr.mergedBy
                                      ? 'Merged by @' + pr.mergedBy.login
                                      : null
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <a href={pr.url} target="_blank">
                                    <IconButton aria-label="Open">
                                      <OpenInNew />
                                    </IconButton>
                                  </a>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </List>
                          </>
                        ))}
                      </>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </Grid>
          </Grid>
        </div>
      </I18nextProvider>
    );
  }
}
Profile.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(Profile));
