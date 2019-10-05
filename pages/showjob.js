/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import AppBarTop from '../components/appbar';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();
import {getHasuraHost} from '../lib/getHasuraHost';

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
import Markdown from 'markdown-to-jsx';
import supportsWebP from 'supports-webp';
import slugify from 'slugify';

let ext = 'png';
supportsWebP ? (ext = 'webp') : (ext = 'png');
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
    backgroundSize: 'contain',
  },
  avatar: {
    pointer: 'cursor',
    width: '100px',
    height: '100px',
  },
  mobileCompanyInfo: {
    textAlign: 'center',
  },
  iconButton: {
    fontSize: '14px',
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
  companyName: {
    textDecoration: 'none',
    color: 'black',
  },
});

class ShowJob extends React.Component {
  state = {
    hasResumePdf: false,
    apply: false,
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
  handleClickApply = () => {
    this.setState({apply: true});
  };
  handleClose = () => {
    this.setState({apply: false});
  };
  handleSendApplication = () => {
    this.setState({apply: false});
    const upsertApplicationopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
        mutation upsert_application(
          $jobId: Int
          $applicantId: Int
          $coverLetter: String
          $hasResumePdf: Boolean
        ) {
          insert_JobApplication(
            objects: [
              {
                jobId: $jobId
                applicantId: $applicantId
                coverLetter: $coverLetter
                hasResumePdf: $hasResumePdf
              }
            ]
            on_conflict: {
              constraint: JobApplication_pkey
              update_columns: [coverLetter, hasResumePdf]
            }
          ) {
            affected_rows
            returning {
              coverLetter
              hasResumePdf
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
      jobId: this.props.job.id,
      applicantId: this.props.userInfo.userId,
      coverLetter: this.state.coverLetter,
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
      this.handleUpdateCallback();
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
    if (query.lang === 'fr') {
      lang = 'fr';
    }
    const translations = await getTranslation(
      lang,
      [
        'common',
        'namespace1',
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
    const jobId = query.jobId || null;
    if (req) {
      query.me && req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      github = req.github;
      linkedin = req.linkedin;
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
    }
    let companyAggregatequery = '';
    if (userInfo.userId) {
      companyAggregatequery = `Company_aggregate(where:
      { _or: [
                    {ownerId: {_eq: $userId}}
                    {ownerId: {_eq: $userId}}
					{Moderators: {User: {id: {_eq: $userId}}}}
                  ]
		})
		{
            aggregate {
              count
            }
            nodes {
             id
              name
            }
          }`;
    }

    const queryOpts = {
      uri: getHasuraHost(process, req, publicRuntimeConfig),
      json: true,
      query: `
        query JobCompanies($id: Int, $userId: Int) {
          ${companyAggregatequery}
          Job(where: {id: {_eq: $id}}) {
            id
            description
            description_fr
            Industry
            remote
            country
            route
            street_number
            locality
            administrative_area_level_1
            postal_code
            location
            Industries {
              IndustryName
            }
            Skills {
              Skill
            }
            Company {
              id
              description
              description_fr
              ownerId
              updatedAt
              yearFounded
              employeeCount
              devCount
              quote1
              quote2
              employee1
              employee2
              media1
              media2
              media3
              Industry
              name
              url
              twitter
              Skills {
                Skill
              }
              Perks {
                Perk
              }
              country
              route
              street_number
              locality
              administrative_area_level_1
              postal_code
              location
            }
            SeniorityLevel
            EmployementType
            Industry
            minimumExperienceYears
            maximumExperienceYears
            SalaryBracket
            createdAt
            updatedAt
            isPublished
            JobTitle
            route
            street_number
            locality
            administrative_area_level_1
            postal_code
            applicationUrl
            applyDirectly
            lat
            lng
            location
            minimumYearlySalary
            maximumYearlySalary
            minimumMonthlySalary
            maximumMonthlySalary
            hasMonthlySalary
          }
        }
      `,
      headers: {
        'x-access-token': token,
      },
    };
    const client = new grequest.GraphQLClient(queryOpts.uri, {
      headers: queryOpts.headers,
    });
    let job = await client.request(queryOpts.query, {
      id: jobId,
      userId: userInfo.userId,
    });
    let companiesCount = job.Company_aggregate;
    let title = 'ReactEurope Jobs - ';

    if (job.Job.length > 0) {
      job = job.Job[0];
      title += job.JobTitle + ' at ' + job.Company.name;
    } else {
      job = null;
    }
    let url;
    req
      ? (url = publicRuntimeConfig.host + req.path)
      : (url = publicRuntimeConfig.host + Router.pathname);

    return {
      translations,
      jobId,
      userInfo,
      job,
      lang,
      companiesCount,
      title,
      url,
    };
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
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  upload = () => {
    console.log(this.state.file);
    if (this.state.file && this.state.file.length > 0) {
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      console.log(formData);
      fetch('/uploadResume', {
        // Your POST endpoint
        method: 'POST',
        headers: {
          applicantId: this.props.userInfo.userId,
          jobId: this.props.job.id,
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

  handleUpdateCallback = () => {
    this.setState({openNotification: true});
  };

  handleCheckboxHasResumePdf = event => {
    this.setState({
      hasResumePdf: !this.state.hasResumePdf,
    });
  };

  render(props) {
    const {classes, job} = this.props;
    const i18n = this.i18n;
    const {open} = this.state;
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <Head
            title={this.props.title}
            description={job.description}
            url={this.props.url}
            ogImage={
              publicRuntimeConfig.cdn +
              job.Company.id +
              '-' +
              'logo.' +
              ext +
              '?u=' +
              job.Company.updatedAt
            }
          />
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
                          aria-label={job.Company.name}
                          src={
                            publicRuntimeConfig.cdn +
                            job.Company.id +
                            '-' +
                            'logo.' +
                            ext +
                            '?u=' +
                            job.Company.updatedAt
                          }
                          className={classes.avatar}
                          style={{borderRadius: 0}}
                        />
                      }
                      title={
                        <Typography gutterBottom variant="h3" component="h1">
                          <Link
                            href={
                              '/companies/' +
                              job.Company.id +
                              '/' +
                              slugify(job.Company.name)
                            }>
                            <a className={classes.companyName}>
                              {job.Company.name}
                            </a>
                          </Link>
                        </Typography>
                      }
                      subheader={
                        <div className={classes.hideOnMobile}>
                          <span>
                            {i18n.t('Since')} {job.Company.yearFounded}
                          </span>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Map">
                            <PlaceIcon className={classes.headerIcons} />{' '}
                            <a
                              href={
                                'https://www.google.com/maps/search/' +
                                this.state.currentAddressDescription
                              }
                              style={{color: 'rgba(0, 0, 0, 0.54)'}}
                              target="_blank">
                              {job.Company.locality}
                            </a>
                          </IconButton>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Employee count">
                            <PeopleIcon className={classes.headerIcons} />{' '}
                            {job.Company.employeeCount} {i18n.t('employees')}
                          </IconButton>
                          <a href={job.Company.url} target="_blank">
                            <IconButton
                              disableRipple={true}
                              disableFocusRipple={true}
                              className={classes.iconButton}
                              aria-label="Company URL"
                              style={{cursor: 'pointer'}}>
                              <LinkIcon className={classes.headerIcons} />{' '}
                              {job.Company.url
                                .replace('http://wwww.', '')
                                .replace('https://wwww.', '')
                                .replace('https://', '')
                                .replace('http://', '')}
                            </IconButton>
                          </a>
                        </div>
                      }
                    />
                    <CardActionArea className={classes.cardActionArea}>
                      <div className={classes.showOnMobile}>
                        <div className={classes.mobileCompanyInfo}>
                          <span>
                            {i18n.t('Since')} {job.Company.yearFounded}
                          </span>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Company's year founded">
                            <PlaceIcon className={classes.headerIcons} />{' '}
                            <a
                              href={
                                'https://www.google.com/maps/search/' +
                                this.state.currentAddressDescription
                              }
                              style={{color: 'rgba(0, 0, 0, 0.54)'}}
                              target="_blank">
                              {job.Company.locality}
                            </a>
                          </IconButton>
                        </div>
                        <div className={classes.mobileCompanyInfo}>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Employees count">
                            <PeopleIcon className={classes.headerIcons} />{' '}
                            {job.Company.employeeCount} {i18n.t('employees')}
                          </IconButton>
                          <a href={job.Company.url} target="_blank">
                            <IconButton
                              disableRipple={true}
                              disableFocusRipple={true}
                              className={classes.iconButton}
                              aria-label="Company's URL"
                              style={{cursor: 'pointer'}}>
                              <LinkIcon className={classes.headerIcons} />{' '}
                              {job.Company.url
                                .replace('http://wwww.', '')
                                .replace('https://wwww.', '')
                                .replace('https://', '')
                                .replace('http://', '')}
                            </IconButton>
                          </a>
                        </div>
                      </div>
                      {job.Company.media1 && job.Company.media1.published ? (
                        <>
                          {job.Company.media1.hasVideo ? (
                            <ReactPlayer
                              url={job.Company.media1.url}
                              width="100%"
                            />
                          ) : (
                            <CardMedia
                              className={classes.media}
                              image={
                                publicRuntimeConfig.cdn +
                                job.Company.id +
                                '-' +
                                '1media.' +
                                ext +
                                '?u=' +
                                job.Company.updatedAt
                              }
                              title={job.Company.name + ' media'}
                              subheader={
                                <>
                                  <span>Since {job.Company.yearFounded}</span>
                                  <IconButton
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    className={classes.iconButton}
                                    aria-label="Company's year founded">
                                    <PlaceIcon
                                      className={classes.headerIcons}
                                    />{' '}
                                    <a
                                      href={
                                        'https://www.google.com/maps/search/' +
                                        this.state.currentAddressDescription
                                      }
                                      style={{color: 'rgba(0, 0, 0, 0.54)'}}
                                      target="_blank">
                                      {job.Company.locality}
                                    </a>
                                  </IconButton>
                                  <IconButton
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    className={classes.iconButton}
                                    aria-label="Employee's count">
                                    <PeopleIcon
                                      className={classes.headerIcons}
                                    />{' '}
                                    {job.Company.employeeCount} employees
                                  </IconButton>
                                  <a href={job.Company.url} target="_blank">
                                    <IconButton
                                      disableRipple={true}
                                      disableFocusRipple={true}
                                      className={classes.iconButton}
                                      aria-label="Company's URL"
                                      style={{cursor: 'pointer'}}>
                                      <LinkIcon
                                        className={classes.headerIcons}
                                      />{' '}
                                      {job.Company.url
                                        .replace('http://wwww.', '')
                                        .replace('https://wwww.', '')
                                        .replace('https://', '')
                                        .replace('http://', '')}
                                    </IconButton>
                                  </a>
                                </>
                              }
                            />
                          )}
                        </>
                      ) : null}
                    </CardActionArea>
                  </Card>
                  <Card className={classes.card}>
                    <CardHeader
                      title={
                        <Typography gutterBottom variant="h3" component="h1">
                          {job.JobTitle}
                          {job.applyDirectly ? (
                            <a
                              style={{
                                textDecoration: 'none',
                              }}
                              href={job.applicationUrl}
                              target="_blank">
                              <Button
                                variant="contained"
                                color="secondary"
                                style={{color: '#FFF', marginLeft: '15px'}}>
                                Apply On Company Site
                              </Button>
                            </a>
                          ) : (
                            <>
                              {this.props.userInfo === null ||
                              this.props.userInfo.github ? (
                                <Button
                                  onClick={this.handleClickApply}
                                  variant="contained"
                                  color="secondary"
                                  style={{color: '#FFF', marginLeft: '15px'}}>
                                  {i18n.t('APPLY NOW')}
                                </Button>
                              ) : null}
                            </>
                          )}
                        </Typography>
                      }
                      subheader={
                        <>
                          <Chip
                            avatar={
                              <Avatar>
                                <PlaceIcon />
                              </Avatar>
                            }
                            label={
                              job.remote
                                ? 'remote'
                                : job.locality
                                  ? job.locality
                                  : job.country
                            }
                            className={classes.chip}
                          />
                          <Chip
                            avatar={
                              <Avatar>
                                <EuroSymbolIcon />
                              </Avatar>
                            }
                            label={
                              job.hasMonthlySalary
                                ? job.minimumMonthlySalary +
                                  '-' +
                                  job.maximumMonthlySalary
                                : job.minimumYearlySalary / 1000 +
                                  'k' +
                                  '-' +
                                  job.maximumYearlySalary / 1000 +
                                  'k'
                            }
                            className={classes.chip}
                          />
                          <Chip
                            avatar={
                              <Avatar>
                                <WorkIcon />
                              </Avatar>
                            }
                            label={
                              new Date().getFullYear() -
                                job.Company.yearFounded >
                              3
                                ? i18n.t('Company (>3 years)')
                                : i18n.t('Startup (<3 years)')
                            }
                            className={classes.chip}
                          />
                        </>
                      }
                    />
                    <>
                      <CardContent>
                        <div style={{textAlign: 'left'}}>
                          <Markdown>
                            {this.props.lang === 'fr' && job.description_fr
                              ? job.description_fr + ''
                              : job.description + ''}
                          </Markdown>{' '}
                        </div>
                      </CardContent>
                      {job.Skills.map(Skill => (
                        <Chip
                          key={Skill.Skill}
                          label={Skill.Skill}
                          className={classes.chiptags}
                          color="secondary"
                        />
                      ))}
                    </>
                    <CardActions>
                      {job.applyDirectly ? (
                        <a
                          style={{
                            textDecoration: 'none',
                          }}
                          href={job.applicationUrl}
                          target="_blank">
                          <Button
                            variant="contained"
                            color="secondary"
                            style={{color: '#FFF', marginLeft: '15px'}}>
                            Apply On Company Site
                          </Button>
                        </a>
                      ) : (
                        <>
                          {this.props.userInfo === null ||
                          this.props.userInfo.github ? (
                            <Button
                              onClick={this.handleClickApply}
                              variant="contained"
                              color="secondary"
                              style={{color: '#FFF', marginLeft: '15px'}}>
                              {i18n.t('APPLY NOW')}
                            </Button>
                          ) : null}
                        </>
                      )}
                    </CardActions>
                  </Card>
                </div>
              </Grid>
            </Grid>
          </div>
          <Dialog
            open={this.state.apply}
            onClose={this.handleClose}
            fullScreen="true"
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              {i18n.t('common:Apply for')}{' '}
              {i18n.t('jobstitles:' + job.JobTitle)} @ {job.Company.name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <a href="/profile" target="_blank">
                  {i18n.t('common:A link to your profile')}
                </a>{' '}
                {i18n.t('common:and cover letter will be sent to')}{' '}
              </DialogContentText>
              <FormControl
                className={classes.formControl}
                error={this.state.namevalid === false}>
                <Input
                  id="logo-simple"
                  name="file"
                  type="file"
                  onChange={e => {
                    console.log(e.target.files);
                    this.setState({file: e.target.files, hasResumePdf: true});
                  }}
                />
                <FormHelperText
                  id={
                    this.state.namevalid !== false
                      ? 'name-helper-text'
                      : 'name-error-text'
                  }>
                  {i18n.t("Your resume's pdf (optional)")}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth={true} className={classes.formControl}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.hasResumePdf}
                      name="hasResumePdf"
                      value="hasResumePdf"
                      onChange={this.handleCheckboxHasResumePdf}
                      color="primary"
                    />
                  }
                  label={this.i18n.t('Include resume pdf')}
                />
              </FormControl>

              <FormControl
                fullWidth={true}
                className={classes.formControl}
                error={this.state.coverLettervalid === false}>
                <InputLabel htmlFor="name-simple">
                  {i18n.t('Cover letter')}
                </InputLabel>
                <Input
                  id="coverLetter"
                  value={this.state.coverLetter}
                  onChange={this.handleChange}
                  name="coverLetter"
                  required={true}
                  multiline={true}
                  rows={20}
                  fullWidth={true}
                />

                <FormHelperText
                  id={
                    this.state.coverLettervalid !== false
                      ? 'coverLetter-helper-text'
                      : 'coverLetter-error-text'
                  }>
                  {this.state.coverLettervalid !== false
                    ? i18n.t(
                        'common:Write a cover letter detailing your motivations',
                      )
                    : i18n.t('common:Writing a cover letter is required')}
                </FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                {i18n.t('common:Cancel')}
              </Button>
              <Button onClick={this.handleSendApplication} color="primary">
                {i18n.t('common:Send application')}
              </Button>
            </DialogActions>
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
            message={
              <span id="message-id">
                {this.i18n.t('common:Your application has been sent!')}
              </span>
            }
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
        </div>
      </I18nextProvider>
    );
  }
}
ShowJob.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(ShowJob));
