/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import AppBarTop from '../components/appbar';
import PropTypes from 'prop-types';
import {getHasuraHost} from '../lib/getHasuraHost';
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
import SKILLS from '../data/skills';
import JOBSTITLES from '../data/jobstitles';

import Cookies from 'js-cookie';

import CloseIcon from '@material-ui/icons/Close';
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
import Head from '../components/head';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Markdown from 'markdown-to-jsx';

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
    openEditBio: false,
    skills: [],
    jobsTitles: [],
    industry: {},
    bio: '',
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

  static async getInitialProps({req, query}) {
    let lang = '';
    if (req && req.locale && req.locale.language) {
      lang = req.locale.language;
    } else if (
      typeof window !== 'undefined' &&
      window &&
      window.navigator &&
      window.navigator.language
    ) {
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
        githubEmail: req.githubEmail,
      };
    } else {
      token = localStorage.getItem('token');
      localStorage.getItem('currentUser')
        ? (userId = JSON.parse(localStorage.getItem('currentUser')).id)
        : (userId = null);
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
    let ownProfile = true;
    if (query && query.userProfileId && query.userProfileId !== null) {
      if (query.userProfileId !== userId) ownProfile = false;
      userId = query.userProfileId;
    }

    let notifications = '';
    let jobsTitlesNotifications = '';
    /*if (ownProfile) {
      notifications = `Notifications{
            Skill userId            }`;
      jobsTitlesNotifications = `JobsTitlesNotifications{
            JobTitle userId
    }`;
    }*/
    let queryOpts = {
      uri: getHasuraHost(process, req, publicRuntimeConfig),
      json: true,
      query:
        `
        query User($id: Int!, $userId: Int) {
          Company_aggregate(
            where: {
              _or: [
                {ownerId: {_eq: $userId}}
                {ownerId: {_eq: $userId}}
                {Moderators: {User: {id: {_eq: $userId}}}}
              ]
            }
          ) {
            aggregate {
              count
            }
            nodes {
              id
              name
            }
          }
          User(where: {id: {_eq: $id}}) {
            id
            githubEmail
            githubAvatarUrl
            githubUsername
            linkedinEmail
            linkedinProfile
            bio
            manualBio
            githubBlogUrl
            firstName
            lastName
            name
            pullRequests
            githubRepositories
            ` +
        notifications +
        jobsTitlesNotifications +
        `
            Companies {
              id
              name
              description
              url
              Industry
              yearFounded
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
    let user = await client.request(queryOpts.query, {
      id: userId,
      userId: userInfo.userId,
    });
    let companiesCount = user.Company_aggregate;

    if (user.User.length > 0) {
      user = user.User[0];
    } else {
      user = null;
    }
    const isCurrentUserProfile = user.id === userInfo.userId;
    let bio = '';
    user && user.manualBio ? (bio = user.manualBio) : (bio = user.bio);

    return {
      translations,
      userId,
      userInfo,
      user,
      isCurrentUserProfile,
      companiesCount,
      ownProfile,
      bio,
    };
  }
  constructor(props) {
    super(props);
    this.i18n = startI18n(props.translations, this.props.lang);
    this.PERKS = PERKS.map(suggestion => ({
      value: suggestion.title,
      label: suggestion.title,
    }));
    this.SKILLS = SKILLS.map(suggestion => ({
      value: suggestion.name,
      label: suggestion.name,
    }));
    this.JOBSTITLES = JOBSTITLES.map(suggestion => ({
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
    /*    let skills = this.props.user.Notifications.map(v => ({
      value: v.Skill,
      label: v.Skill,
    }));
    let jobsTitles = this.props.user.JobsTitlesNotifications.map(v => ({
      value: v.JobTitle,
      label: v.JobTitle,
    }));*/
    this.setState({
      showNotifications: false,
    });
  }

  handleEditBioDialog = () => {
    this.setState({openEditBio: true, bio: this.props.bio});
  };

  handleChangeSkills = value => {
    if (value) {
      this.setState({skills: value, skillsvalid: true});
    } else {
      this.setState({
        skills: this.state.skills,
        skillsvalid: false,
      });
    }
  };

  handleChangeJobsTitlesNotifications = value => {
    if (value) {
      this.setState({
        jobsTitles: value,
        jobsTitlesvalid: true,
      });
    } else {
      this.setState({
        jobsTitles: this.state.jobsTitles,
        jobsTitlesvalid: false,
      });
    }
  };

  handleBioChange = event => {
    if (event.target.value.length <= 1024) {
      this.setState({[event.target.name]: event.target.value});
    }
  };

  handleClose = () => {
    this.setState({openEditBio: false});
  };

  handleSaveBio = async () => {
    this.setState({openEditBio: false});
    const {userInfo, userId} = this.props;
    const queryOpts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
        mutation updateBio($userId: Int, $bio: String!) {
          update_User(where: {id: {_eq: $userId}}, _set: {manualBio: $bio}) {
            returning {
              manualBio
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
    let user = await client.request(queryOpts.query, {
      userId: userId,
      bio: this.state.bio,
    });
    Router.push('/profile');
  };

  handleSaveNotifications = async () => {
    const {userInfo, userId} = this.props;
    const queryOpts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
        mutation updateNotifications(
          $userId: Int
          $skills: [Notification_insert_input!]!
          $jobsTitles: [JobTitleNotification_insert_input!]!
        ) {
          delete_Notification(where: {userId: {_eq: $userId}}) {
            affected_rows
          }
          insert_Notification(objects: $skills) {
            returning {
              Skill
            }
          }
          delete_JobTitleNotification(where: {userId: {_eq: $userId}}) {
            affected_rows
          }
          insert_JobTitleNotification(objects: $jobsTitles) {
            returning {
              JobTitle
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
    let skills = [];
    this.state.skills
      ? this.state.skills.map(skill => {
          skills.push({
            Skill: skill.value,
            userId: userId,
          });
        })
      : null;
    let jobsTitles = [];
    console.log(this.state.jobsTitles);
    this.state.jobsTitles
      ? this.state.jobsTitles.map(jobsTitle => {
          jobsTitles.push({
            JobTitle: jobsTitle.value,
            userId: userId,
          });
        })
      : null;

    let user = await client.request(queryOpts.query, {
      userId: userId,
      skills: skills,
      jobsTitles: jobsTitles,
    });
    Router.push('/profile');
  };
  render(props) {
    const {classes, user} = this.props;
    const i18n = this.i18n;
    const {open} = this.state;
    const skills = this.SKILLS;
    const jobsTitles = this.JOBSTITLES;
    let title = `ReactEurope Jobs - ${user.name}`;
    let bio = this.props.bio;
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <Head title={title} />
          <Dialog
            open={this.state.openEditBio}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              {i18n.t('Edit your bio')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {i18n.t(
                  'We fetch your bio automatically from your Github account but you can edit it. Markdown accepted. 1024 charcters max',
                )}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                value={this.state.bio}
                name="bio"
                id="bio"
                label={i18n.t('Bio')}
                onChange={this.handleBioChange}
                maxlength={1024}
                type="text"
                multiline={true}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Typography
                style={{
                  color: this.state.bio.length === 1024 ? 'red' : 'black',
                }}>
                {this.state.bio.length} chars
              </Typography>
              <Button onClick={this.handleClose} color="primary">
                {i18n.t('Cancel')}
              </Button>
              <Button onClick={this.handleSaveBio} color="primary">
                {i18n.t('Save')}
              </Button>
            </DialogActions>
          </Dialog>
          <NewJobBar
            i18n={this.i18n}
            userInfo={this.props.userInfo}
            companyCount={this.props.companiesCount}
          />
          <div style={{paddingLeft: 12, paddingRight: 12}}>
            <Grid container spacing={24}>
              <Grid item xs={12} md={3}>
                <MenuList
                  i18n={i18n}
                  userInfo={this.props.userInfo}
                  companyCount={this.props.companiesCount}
                />
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
                        bio ? (
                          <>
                            <Markdown>{bio}</Markdown>{' '}
                            <a href={user.githubBlogUrl} target="_blank">
                              {user.githubBlogUrl}
                            </a>{' '}
                            {this.props.ownProfile ? (
                              <Button onClick={this.handleEditBioDialog}>
                                edit
                              </Button>
                            ) : null}
                          </>
                        ) : null
                      }
                    />
                    {this.props.ownProfile && this.state.showNotifications ? (
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography
                            variant="h4"
                            gutterBottom
                            className={classes.title}>
                            Notifications
                          </Typography>
                          <FormControl
                            fullWidth={true}
                            className={classes.formControl}>
                            <MultipleDownshiftSelect
                              i18n={this.i18n}
                              suggestions={skills}
                              selectedItems={this.state.skills || []}
                              label={this.i18n.t('newjob:Skills')}
                              placeholder={this.i18n.t(
                                'newjob:Select multiple skills (up to 25)',
                              )}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              handleParentChange={this.handleChangeSkills}
                              handleParentBlur={this.handleBlurSkills}
                              name="skills"
                              id="skills"
                              maxSelection={25}
                              required={true}
                            />
                            <FormHelperText>
                              {this.i18n.t(
                                'newjob:Select skills for jobs you would like to be notified of.',
                              )}
                            </FormHelperText>
                          </FormControl>

                          <FormControl
                            fullWidth={true}
                            className={classes.formControl}>
                            <MultipleDownshiftSelect
                              i18n={this.i18n}
                              suggestions={jobsTitles}
                              selectedItems={this.state.jobsTitles || []}
                              label={this.i18n.t('newjob:Job Titles')}
                              placeholder={this.i18n.t(
                                'newjob:Select multiple jobsTitles (up to 25)',
                              )}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              handleParentChange={
                                this.handleChangeJobsTitlesNotifications
                              }
                              handleParentBlur={this.handleBlurSkills}
                              name="jobsTitles"
                              id="jobsTitles"
                              maxSelection={25}
                              required={true}
                            />
                            <FormHelperText>
                              {this.i18n.t(
                                'newjob:Select jobs titles for jobs you would like to be notified of.',
                              )}
                            </FormHelperText>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={this.handleSaveNotifications}
                              className={classes.button}>
                              {this.i18n.t('Save')}
                            </Button>
                          </FormControl>
                        </CardContent>
                      </Card>
                    ) : null}
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
                      {user.linkedinProfile &&
                      user.linkedinProfile.positions ? (
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
                                    {position.startDate
                                      ? i18n.t('from ') +
                                        position.startDate.month +
                                        '/'
                                      : null}
                                    {position.startDate
                                      ? position.startDate.year
                                      : null}
                                    {position.isCurrent && position.startDate
                                      ? i18n.t(' to present')
                                      : position.endDate
                                        ? i18n.t('until ') +
                                          position.endDate.month +
                                          '/' +
                                          position.endDate.year
                                        : null}
                                  </>
                                }
                              />
                            </ListItem>
                          </List>
                        ))
                      ) : (
                        <>
                          //TODO fix with new linkedin API
                          {false && this.props.isCurrentUserProfile ? (
                            <CardActions>
                              <a
                                href={`https://www.linkedin.com/oauth/v2/authorization?client_id=${
                                  publicRuntimeConfig.linkedinId
                                }&response_type=code&redirect_uri=${
                                  publicRuntimeConfig.publicHostname
                                }&scope=r_basicprofile%20r_emailaddress`}>
                                i18n.t('Connect to linkedin to fill your
                                positions automatically')
                              </a>
                            </CardActions>
                          ) : (
                            i18n.t('This user has not filled their profile yet')
                          )}
                        </>
                      )}
                      <Typography
                        variant="h4"
                        gutterBottom
                        className={classes.title}>
                        {i18n.t('Open Source Contributions')}
                      </Typography>
                      <Typography
                        variant="p"
                        component="p"
                        className={classes.title}>
                        {i18n.t(
                          'Keep in mind that any lack of open source contributions ' +
                            'does not mean lack of skills and that all candidates should ' +
                            'be investigated further based on other factors such' +
                            ' as  as skills, previous positions, education, interview process etc',
                        )}
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
                            {i18n.t('Repositories contributed to')}
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
                                        [
                                        {repo.primaryLanguage
                                          ? repo.primaryLanguage.name
                                          : null}
                                        ] {repo.nameWithOwner} (
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
                            {i18n.t('Merged Pull Requests')}
                          </Typography>
                          {user.pullRequests.nodes.map(pr => (
                            <>
                              <List key={pr.id} dense={true}>
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar
                                      src={pr.repository.owner.avatarUrl}
                                    />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <>
                                        {pr.repository.primaryLanguage ? (
                                          <>
                                            [
                                            {pr.repository.primaryLanguage.name}
                                            ]{' '}
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
        </div>
      </I18nextProvider>
    );
  }
}
Profile.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(Profile));
