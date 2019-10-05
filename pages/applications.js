/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import AppBarTop from '../components/appbar';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NewJobBar from '../components/newjobbar';
import {withStyles} from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from '@material-ui/core/Grid';
import {Parallax} from 'react-parallax';
import getConfig from 'next/config';
import {getHasuraHost} from '../lib/getHasuraHost';

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
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '../components/menu';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
import {TwitterCircle, GithubCircle} from 'mdi-material-ui';
import {withRouter} from 'next/router';
import Slider, {Range} from 'rc-slider';
import Tooltip from 'rc-tooltip';
import CardHeader from '@material-ui/core/CardHeader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Head from '../components/head';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import deleteJobApplication from '../queries/DeleteJobApplication.gql';
import updateJobApplicationStatus from '../queries/UpdateJobApplicationStatus.gql';

import Markdown from 'markdown-to-jsx';

import 'rc-slider/assets/index.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const TooltipRange = createSliderWithTooltip(Range);
const {publicRuntimeConfig} = getConfig();

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
    height: 400,
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

class IndexApplications extends React.Component {
  state = {
    hasResumePdf: false,
    apply: false,
    message: false,
    currentJobApplication: {
      Applicant: {name: ''},
      Job: {JobTitle: '', Company: {name: ''}},
    },
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
  handleClickEditApplication = (e, jobApplication) => {
    console.log('edit', jobApplication);
    this.setState({
      apply: true,
      currentJobApplication: jobApplication,
      hasResumePdf: true,
    });
  };

  handleClickDeleteApplication = (e, jobApplication) => {
    let rm = confirm(
      this.i18n.t(
        'applications:Are you sure you want to delete this application?',
      ),
    );
    if (rm) {
      const deleteApplicationopts = {
        uri: getHasuraHost(process, undefined, publicRuntimeConfig),
        json: true,
        query: deleteJobApplication.loc.source.body,
        headers: {
          'x-access-token': Cookies.get('token'),
          'x-access-role': 'userType',
        },
      };
      let vars = {
        applicationId: jobApplication.id,
      };

      const client = new grequest.GraphQLClient(deleteApplicationopts.uri, {
        headers: deleteApplicationopts.headers,
      });

      client.request(deleteApplicationopts.query, vars).then(gdata => {
        this.handleUpdateCallback(
          this.i18n.t(
            'applications:Your application has been deleted successfully',
          ),
        );
      });
    }
  };

  handleClickAcceptApplication = (e, jobApplication) => {
    let rm = confirm(
      this.i18n.t(
        'applications:Are you sure you want to accept this application?',
      ),
    );
    if (rm) {
      const acceptApplicationopts = {
        uri: getHasuraHost(process, undefined, publicRuntimeConfig),
        json: true,
        query: updateJobApplicationStatus.loc.source.body,
        headers: {
          'x-access-token': Cookies.get('token'),
          'x-access-role': 'userType',
        },
      };
      let vars = {
        id: jobApplication.id,
        status: true,
      };

      const client = new grequest.GraphQLClient(acceptApplicationopts.uri, {
        headers: acceptApplicationopts.headers,
      });

      client.request(acceptApplicationopts.query, vars).then(gdata => {
        this.handleUpdateCallback(
          this.i18n.t(
            'applications:This application has been accepted successfully',
          ),
        );
      });
    }
  };

  handleClickRejectApplication = (e, jobApplication) => {
    let rm = confirm(
      this.i18n.t(
        'applications:Are you sure you want to decline this application?',
      ),
    );
    if (rm) {
      const acceptApplicationopts = {
        uri: getHasuraHost(process, undefined, publicRuntimeConfig),
        json: true,
        query: updateJobApplicationStatus.loc.source.body,
        headers: {
          'x-access-token': Cookies.get('token'),
          'x-access-role': 'userType',
        },
      };
      let vars = {
        id: jobApplication.id,
        status: false,
      };

      const client = new grequest.GraphQLClient(acceptApplicationopts.uri, {
        headers: acceptApplicationopts.headers,
      });

      client.request(acceptApplicationopts.query, vars).then(gdata => {
        this.handleUpdateCallback(
          this.i18n.t(
            'applications:This application has been declined successfully',
          ),
        );
      });
    }
  };

  handleClickMessage = (e, jobApplication) => {
    this.setState({message: true, currentJobApplication: jobApplication});
  };
  handleBlur = (event, required) => {
    this.setState({
      [event.target.name + 'valid']:
        event.target.value || !required ? true : false,
    });
  };

  handleClose = () => {
    this.setState({message: false, bodyvalid: true});
  };
  handleSendMessage = () => {
    this.setState({apply: false});
    const inserMessageopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
				mutation insert_Message($body: String!,
				  $applicationId: Int!,
				  $userId: Int!) {
				  insert_Message(objects: [{body: $body,
					userId: $userId,
					applicationId: $applicationId}]) {
					affected_rows
				  }
				}
		        `,
      headers: {
        'x-access-token': Cookies.get('token'),
      },
    };
    let vars = {
      applicationId: this.state.currentJobApplication.id,
      userId: this.props.userInfo.userId,
      body: this.state.body,
    };

    const client = new grequest.GraphQLClient(inserMessageopts.uri, {
      headers: inserMessageopts.headers,
    });

    client.request(inserMessageopts.query, vars).then(gdata => {
      this.setState({
        message: false,
      });
      this.handleUpdateCallback(
        this.i18n.t('applications:Your message has been sent successfully'),
      );
    });
  };
  handleSendApplication = () => {
    this.setState({apply: false});
    const upsertApplicationopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
				mutation upsert_application($jobId: Int, $applicantId: Int,
				$coverLetter: String, $hasResumePdf: Boolean) {
				  insert_JobApplication(
					objects: [
					  {jobId: $jobId, applicantId: $applicantId,
						coverLetter: $coverLetter, hasResumePdf: $hasResumePdf}
					],
					on_conflict: {
					  constraint: JobApplication_pkey,
					  update_columns: [coverLetter, hasResumePdf]
					}
				  ) {
					affected_rows
					returning{
					  coverLetter, hasResumePdf
					}
				  }
				}
        `,
      headers: {
        'x-access-token': Cookies.get('token'),
        'x-access-role': 'userType',
      },
    };
    let vars = {
      jobId: this.state.currentJobApplication.jobId,
      applicantId: this.state.currentJobApplication.applicantId,
      coverLetter: this.state.currentJobApplication.coverLetter,
      hasResumePdf: this.state.hasResumePdf,
    };

    const client = new grequest.GraphQLClient(upsertApplicationopts.uri, {
      headers: upsertApplicationopts.headers,
    });

    client.request(upsertApplicationopts.query, vars).then(gdata => {
      this.upload();
      this.setState({
        apply: false,
      });
      this.handleUpdateCallback(
        this.i18n.t(
          'applications:Your application has been updated successfully',
        ),
      );
    });
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
        'applications',
      ],
      'http://localhost:4000/static/locales/',
    );
    let userInfo = {};
    let token = null;
    let userId = null;
    let github = false;
    let linkedin = false;
    const jobId = query.jobId || null;
    if (req) {
      query.me && req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      github = req.github;
      linkedin = req.linkedin;
      userId = req.userId;
      userInfo = {
        userId: req.userId,
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
    console.log('userInfo', userInfo);
    const queryOpts = {
      uri: getHasuraHost(process, req, publicRuntimeConfig),
      json: true,
      query: `
        query Applications($userId: Int) {
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
          JobApplication(
            where: {
              _or: [
                {Job: {Company: {Moderators: {User: {id: {_eq: $userId}}}}}}
                {applicantId: {_eq: $userId}}
                {Job: {Company: {ownerId: {_eq: $userId}}}}
              ]
            }
          ) {
            coverLetter
            jobId
            applicantId
            status
            hasResumePdf
            Messages {
              body
              createdAt
              User {
                name
                githubAvatarUrl
                linkedinAvatarUrl
              }
            }
            createdAt
            updatedAt
            id
            Job {
              JobTitle
              Company {
                name
              }
            }
            Applicant {
              id
              linkedinProfile
              githubEmail
              githubUsername
              firstName
              lastName
              name
              githubAvatarUrl
            }
          }
        }
      `,
      headers: {
        'x-access-token': userInfo.token,
        'x-access-role': 'userType',
      },
    };
    const client = new grequest.GraphQLClient(queryOpts.uri, {
      headers: queryOpts.headers,
    });
    let applicationsData = await client.request(queryOpts.query, {
      userId: userId,
    });
    let applications = [];

    if (applicationsData.JobApplication.length > 0) {
      applications = applicationsData.JobApplication;
    }
    let companiesCount = applicationsData.Company_aggregate;
    console.log(applications);

    return {translations, userInfo, applications, companiesCount};
  }
  constructor(props) {
    super(props);
    this.i18n = startI18n(props.translations, this.props.lang);
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
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };
  handleFocus = (event, required) => {
    this.setState({
      [event.target.name + 'valid']: true,
    });
  };

  handleUpdateCallback = notification => {
    this.setState({
      openNotification: true,
      notification: notification,
    });
    Router.push('/applications');
  };

  handleCheckboxHasResumePdf = event => {
    this.setState({
      hasResumePdf: !this.state.currentJobApplication.hasResumePdf,
      currentJobApplication: {
        ...this.state.currentJobApplication,
        ...{hasResumePdf: !this.state.currentJobApplication.hasResumePdf},
      },
    });
  };

  upload = () => {
    if (this.state.file && this.state.file.length > 0) {
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      fetch('/uploadResume', {
        // Your POST endpoint
        method: 'POST',
        headers: {
          applicantId: this.props.userInfo.userId,
          jobId: this.state.currentJobApplication.jobId,
        },
        body: formData, // This is your file object
      })
        .then(
          response => response.json(), // if the response is a JSON object
        )
        .then(
          success => console.log(success), // Handle the success response object
        )
        .catch(
          error => console.log(error), // Handle the error response object
        );
    }
  };
  handleChangeIndex = index => {
    this.setState({value: index});
  };
  render(props) {
    const {classes, applications} = this.props;
    const i18n = this.i18n;
    const {open} = this.state;
    let title = this.i18n.t('ReactEurope Jobs - Applications');
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <Head title={title} />
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
                  <AppBar position="static" color="default">
                    <Tabs
                      value={this.state.value}
                      onChange={(event, value) => {
                        this.setState({value});
                      }}
                      indicatorColor="primary"
                      textColor="primary"
                      fullWidth>
                      <Tab label={i18n.t('applications:Reviewing')} />
                      <Tab label={i18n.t('applications:Accepted')} />
                      <Tab label={i18n.t('applications:Declined')} />
                    </Tabs>
                  </AppBar>
                  <SwipeableViews
                    axis="x"
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}>
                    <>
                      {applications.map(application => (
                        <div key={application.jobId + application.applicantId}>
                          {application.status === null ? (
                            <Card
                              className={classes.card}
                              key={application.jobId + application.applicantId}>
                              <CardHeader
                                avatar={
                                  <Avatar
                                    aria-label={application.Job.Company.name}
                                    src={application.Applicant.githubAvatarUrl}
                                    className={classes.avatar}
                                  />
                                }
                                title={
                                  <Typography variant="h5" gutterBottom>
                                    <Link
                                      href={
                                        '/profile/' + application.Applicant.id
                                      }>
                                      <a>{application.Applicant.name}</a>
                                    </Link>{' '}
                                    {i18n.t('applications:applied for')}{' '}
                                    {i18n.t(
                                      'jobstitles:' + application.Job.JobTitle,
                                    )}{' '}
                                    @ {application.Job.Company.name}
                                  </Typography>
                                }
                                subheader={application.coverLetter}
                              />
                              <CardActions>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={e =>
                                    this.handleClickMessage(e, application)
                                  }
                                  style={{color: '#FFF', marginLeft: '15px'}}>
                                  {i18n.t('applications:Message')}
                                </Button>
                                {this.props.userInfo.github ? (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={e =>
                                        this.handleClickEditApplication(
                                          e,
                                          application,
                                        )
                                      }
                                      style={{
                                        color: '#FFF',
                                        marginLeft: '15px',
                                      }}>
                                      {i18n.t('common:edit')}
                                    </Button>
                                    <Button
                                      onClick={e =>
                                        this.handleClickDeleteApplication(
                                          e,
                                          application,
                                        )
                                      }
                                      variant="contained"
                                      color="secondary"
                                      style={{
                                        color: '#FFF',
                                        marginLeft: '15px',
                                      }}>
                                      {i18n.t('common:delete')}
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {!application.status ? (
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={e =>
                                          this.handleClickAcceptApplication(
                                            e,
                                            application,
                                          )
                                        }
                                        style={{
                                          color: '#FFF',
                                          marginLeft: '15px',
                                        }}>
                                        ✓ {i18n.t('applications:Got it')}
                                      </Button>
                                    ) : null}
                                    {application.status ||
                                    application.status === null ? (
                                      <Button
                                        variant="contained"
                                        onClick={e =>
                                          this.handleClickRejectApplication(
                                            e,
                                            application,
                                          )
                                        }
                                        style={{
                                          backgroundColor: '#f50057',
                                          color: '#FFF',
                                          marginLeft: '15px',
                                        }}>
                                        ✘ {i18n.t('applications:Not a fit')}
                                      </Button>
                                    ) : null}
                                  </>
                                )}
                                {application.hasResumePdf ? (
                                  <a
                                    href={
                                      '/' +
                                      application.jobId +
                                      '-' +
                                      application.applicantId +
                                      '-resume.pdf'
                                    }
                                    target="_blank">
                                    Download resume
                                  </a>
                                ) : null}
                              </CardActions>
                            </Card>
                          ) : null}
                        </div>
                      ))}
                    </>
                    <>
                      {applications.map(application => (
                        <div key={application.jobId + application.applicantId}>
                          {application.status ? (
                            <Card
                              className={classes.card}
                              key={application.jobId + application.applicantId}>
                              <CardHeader
                                avatar={
                                  <Avatar
                                    aria-label={application.Job.Company.name}
                                    src={application.Applicant.githubAvatarUrl}
                                    className={classes.avatar}
                                  />
                                }
                                title={
                                  <Typography variant="h5" gutterBottom>
                                    <Link
                                      href={
                                        '/profile/' + application.Applicant.id
                                      }>
                                      <a>{application.Applicant.name}</a>
                                    </Link>{' '}
                                    {i18n.t('applications:applied for')}{' '}
                                    {i18n.t(
                                      'jobstitles:' + application.Job.JobTitle,
                                    )}{' '}
                                    @ {application.Job.Company.name}
                                  </Typography>
                                }
                                subheader={application.coverLetter}
                              />
                              <CardActions>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={e =>
                                    this.handleClickMessage(e, application)
                                  }
                                  style={{color: '#FFF', marginLeft: '15px'}}>
                                  {i18n.t('applications:Message')}
                                </Button>
                                {this.props.userInfo.github ? (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={e =>
                                        this.handleClickEditApplication(
                                          e,
                                          application,
                                        )
                                      }
                                      style={{
                                        color: '#FFF',
                                        marginLeft: '15px',
                                      }}>
                                      {i18n.t('common:edit')}
                                    </Button>
                                    <Button
                                      onClick={e =>
                                        this.handleClickDeleteApplication(
                                          e,
                                          application,
                                        )
                                      }
                                      variant="contained"
                                      color="secondary"
                                      style={{
                                        color: '#FFF',
                                        marginLeft: '15px',
                                      }}>
                                      {i18n.t('common:delete')}
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {!application.status ? (
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={e =>
                                          this.handleClickAcceptApplication(
                                            e,
                                            application,
                                          )
                                        }
                                        style={{
                                          color: '#FFF',
                                          marginLeft: '15px',
                                        }}>
                                        ✓ {i18n.t('applications:Got it')}
                                      </Button>
                                    ) : null}
                                    {application.status ||
                                    application.status === null ? (
                                      <Button
                                        variant="contained"
                                        onClick={e =>
                                          this.handleClickRejectApplication(
                                            e,
                                            application,
                                          )
                                        }
                                        style={{
                                          backgroundColor: '#f50057',
                                          color: '#FFF',
                                          marginLeft: '15px',
                                        }}>
                                        ✘ {i18n.t('applications:Not a fit')}
                                      </Button>
                                    ) : null}
                                  </>
                                )}
                                {application.hasResumePdf ? (
                                  <a
                                    href={
                                      '/' +
                                      application.jobId +
                                      '-' +
                                      application.applicantId +
                                      '-resume.pdf'
                                    }
                                    target="_blank">
                                    Download resume
                                  </a>
                                ) : null}
                              </CardActions>
                            </Card>
                          ) : null}
                        </div>
                      ))}
                    </>
                    <>
                      {applications.map(application => (
                        <div key={application.jobId + application.applicantId}>
                          {application.status === false ? (
                            <Card
                              className={classes.card}
                              key={application.jobId + application.applicantId}>
                              <CardHeader
                                avatar={
                                  <Avatar
                                    aria-label={application.Job.Company.name}
                                    src={application.Applicant.githubAvatarUrl}
                                    className={classes.avatar}
                                  />
                                }
                                title={
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    gutterBottom>
                                    <Link
                                      href={
                                        '/profile/' + application.Applicant.id
                                      }>
                                      <a>{application.Applicant.name}</a>
                                    </Link>{' '}
                                    applied for {application.Job.JobTitle} @{' '}
                                    {application.Job.Company.name}
                                  </Typography>
                                }
                                subheader={application.coverLetter}
                              />
                              <CardActions>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={e =>
                                    this.handleClickMessage(e, application)
                                  }
                                  style={{color: '#FFF', marginLeft: '15px'}}>
                                  {i18n.t('applications:Message')}
                                </Button>
                                {this.props.userInfo.github ? (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={e =>
                                        this.handleClickEditApplication(
                                          e,
                                          application,
                                        )
                                      }
                                      style={{
                                        color: '#FFF',
                                        marginLeft: '15px',
                                      }}>
                                      {i18n.t('common:edit')}
                                    </Button>
                                    <Button
                                      onClick={e =>
                                        this.handleClickDeleteApplication(
                                          e,
                                          application,
                                        )
                                      }
                                      variant="contained"
                                      color="secondary"
                                      style={{
                                        color: '#FFF',
                                        marginLeft: '15px',
                                      }}>
                                      {i18n.t('common:delete')}
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {!application.status ? (
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={e =>
                                          this.handleClickAcceptApplication(
                                            e,
                                            application,
                                          )
                                        }
                                        style={{
                                          color: '#FFF',
                                          marginLeft: '15px',
                                        }}>
                                        ✓ {i18n.t('applications:Got it')}
                                      </Button>
                                    ) : null}
                                    {application.status ||
                                    application.status === null ? (
                                      <Button
                                        variant="contained"
                                        onClick={e =>
                                          this.handleClickRejectApplication(
                                            e,
                                            application,
                                          )
                                        }
                                        style={{
                                          backgroundColor: '#f50057',
                                          color: '#FFF',
                                          marginLeft: '15px',
                                        }}>
                                        ✘ {i18n.t('applications:Not a fit')}
                                      </Button>
                                    ) : null}
                                  </>
                                )}
                                {application.hasResumePdf ? (
                                  <a
                                    href={
                                      '/' +
                                      application.jobId +
                                      '-' +
                                      application.applicantId +
                                      '-resume.pdf'
                                    }
                                    target="_blank">
                                    Download resume
                                  </a>
                                ) : null}
                              </CardActions>
                            </Card>
                          ) : null}
                        </div>
                      ))}
                    </>
                  </SwipeableViews>
                </div>
              </Grid>
            </Grid>
          </div>
          <Dialog
            open={this.state.message}
            onClose={this.handleClose}
            fullScreen={true}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              {i18n.t('applications:messageTo')}{' '}
              {this.props.userInfo.github
                ? this.state.currentJobApplication.Job.Company.name
                : this.state.currentJobApplication.Applicant.name}{' '}
              {i18n.t('applications:about')}{' '}
              {i18n.t(
                'jobstitles:' + this.state.currentJobApplication.Job.JobTitle,
              )}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {i18n.t('applications:Send a message about this application')}
              </DialogContentText>
              <form>
                <FormControl
                  fullWidth={true}
                  className={classes.formControl}
                  error={this.state.bodyvalid === false}>
                  <InputLabel htmlFor="name-simple">
                    {i18n.t('Message')}
                  </InputLabel>
                  <Input
                    id="body"
                    value={this.state.body}
                    onChange={this.handleChange}
                    onBlur={e => this.handleBlur(e, true)}
                    onFocus={e => this.handleFocus(e, true)}
                    name="body"
                    required={true}
                    multiline={true}
                    rows={20}
                    fullWidth={true}
                  />

                  <FormHelperText
                    id={
                      this.state.bodyvalid !== false
                        ? 'body-helper-text'
                        : 'body-error-text'
                    }>
                    {this.state.bodyvalid !== false
                      ? i18n.t(
                          'applications:Send a message about any question you may have about this application',
                        )
                      : i18n.t(
                          'applications:Please make sure to include some text before sending',
                        )}
                  </FormHelperText>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                {i18n.t('common:Cancel')}
              </Button>
              <Button
                disabled={!this.state.bodyvalid}
                onClick={this.handleSendMessage}
                color="primary">
                {i18n.t('applications:Send message')}
              </Button>
            </DialogActions>{' '}
            {this.state.currentJobApplication.Messages &&
            this.state.currentJobApplication.Messages.length > 0 ? (
              <div style={{height: '60%'}}>
                <DialogContentText>Previous messages</DialogContentText>
                {this.state.currentJobApplication.Messages.map(message => (
                  <Card className={classes.card} key={message.id}>
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label={message.User.name}
                          src={
                            message.User.githubAvatarUrl
                              ? message.User.githubAvatarUrl
                              : message.User.linkedinAvatarUrl
                          }
                          className={classes.avatar}
                        />
                      }
                      title={
                        <Typography gutterBottom variant="h3" component="h3">
                          {message.User.name} said
                        </Typography>
                      }
                      subheader={new Date(message.createdAt).toLocaleString()}
                    />
                    <CardContent>
                      <Markdown>{message.body}</Markdown>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </Dialog>
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
            message={<span id="message-id">{this.state.notification}</span>}
            action={[
              /*  TODO implement undo save company
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    this.setState({openNotification: false});
                  }}>
                  UNDO
                </Button>,*/
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
          <Dialog
            open={this.state.apply}
            onClose={() => this.setState({apply: false})}
            fullScreen={true}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              {i18n.t('applications:Update your application for')}{' '}
              {i18n.t(
                'jobstitles:' + this.state.currentJobApplication.Job.JobTitle,
              )}{' '}
              @ {this.state.currentJobApplication.Job.Company.name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <a href="/profile" target="_blank">
                  {i18n.t('common:A link to your profile')}
                </a>{' '}
                {i18n.t('common:and cover letter will be sent to')}{' '}
                {this.state.currentJobApplication.Job.Company.name}
              </DialogContentText>
              <FormControl
                className={classes.formControl}
                error={this.state.namevalid === false}>
                <Input
                  id="logo-simple"
                  name="file"
                  type="file"
                  onChange={e => {
                    this.setState({
                      file: e.target.files,
                      hasResumePdf: true,
                      currentJobApplication: {
                        ...this.state.currentJobApplication,
                        ...{
                          hasResumePdf: true,
                        },
                      },
                    });
                  }}
                />
                <FormHelperText
                  id={
                    this.state.namevalid !== false
                      ? 'name-helper-text'
                      : 'name-error-text'
                  }>
                  {i18n.t("common:Your resume's pdf (optional)")}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth={true} className={classes.formControl}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="hasResumePdf"
                      value={this.state.hasResumePdf}
                      onChange={this.handleCheckboxHasResumePdf}
                      color="primary"
                    />
                  }
                  label={this.i18n.t('common:Include resume pdf')}
                />
              </FormControl>

              <FormControl
                fullWidth={true}
                className={classes.formControl}
                error={
                  this.state.currentJobApplication.coverLettervalid === false
                }>
                <InputLabel htmlFor="name-simple">
                  {i18n.t('common:Cover letter')}
                </InputLabel>
                <Input
                  id="coverLetter"
                  value={this.state.currentJobApplication.coverLetter}
                  onChange={event =>
                    this.setState({
                      currentJobApplication: {
                        ...this.state.currentJobApplication,
                        ...{coverLetter: event.target.value},
                      },
                    })
                  }
                  name="coverLetter"
                  required={true}
                  multiline={true}
                  rows={20}
                  fullWidth={true}
                />

                <FormHelperText
                  id={
                    this.state.currentJobApplication.coverLettervalid !== false
                      ? 'coverLetter-helper-text'
                      : 'coverLetter-error-text'
                  }>
                  {this.state.currentJobApplication.coverLettervalid !== false
                    ? i18n.t(
                        'common:Write a cover letter detailing your motivations',
                      )
                    : i18n.t('common:Writing a cover letter is required')}
                </FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({apply: false})}
                color="primary">
                {i18n.t('common:Cancel')}
              </Button>
              <Button onClick={this.handleSendApplication} color="primary">
                {i18n.t('common:Update application')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </I18nextProvider>
    );
  }
}
IndexApplications.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(IndexApplications));
