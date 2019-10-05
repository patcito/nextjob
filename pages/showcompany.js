/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import Head from '../components/head';
import AppBarTop from '../components/appbar';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();
import {getHasuraHost} from '../lib/getHasuraHost';
import Markdown from 'markdown-to-jsx';

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
import supportsWebP from 'supports-webp';
import slugify from 'slugify';

let ext = 'png';
supportsWebP ? (ext = 'webp') : (ext = 'png');

import 'rc-slider/assets/index.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const TooltipRange = createSliderWithTooltip(Range);

// get language from query parameter or url path
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
  mobileCompanyInfo: {
    textAlign: 'center',
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

  cardActionArea: {
    width: '100%',
  },
  media: {
    height: 400,
    backgroundSize: 'contain',
  },
  avatar: {
    pointer: 'cursor',
    '@media (min-width: 728px)': {
      width: '100px',
      height: '100px',
    },
  },
  iconButton: {
    fontSize: '14px',
    width: '25%',
    '@media (max-width: 728px)': {
      width: '50%',
    },
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'auto',
    },
  },
  headerIcons: {
    marginRight: '5px',
  },
});

class ShowCompany extends React.Component {
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
      description_fr: '',
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
    const companyId = query.companyId || null;
    if (req) {
      query.me && req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      github = req.github;
      linkedin = req.linkedin;
      userInfo = {
        userId: req.userId ? req.userId : null,
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
        query JobCompanies($ownerId: Int, $companyId: Int, $userId: Int) {
			${companyAggregatequery}
          Company(
            where: {_and: [{id: {_eq: $companyId}}, {ownerId: {_eq: $ownerId}}]}
          ) {
            id
            description
            description_fr
            ownerId
            yearFounded
            updatedAt
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
            Moderators {
              userEmail
            }
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
    let qcompany = await client.request(queryOpts.query, {
      userId: userInfo.userId,
      ownerId: userId,
      companyId: companyId,
    });
    let companiesCount = qcompany.Company_aggregate;

    if (qcompany.Company.length > 0) {
      qcompany = qcompany.Company[0];
    } else {
      qcompany = null;
    }
    let company = qcompany;
    if (!company.employee1) {
      company.employee1 = {
        name: '',
        title: '',
        bio: '',
        twitter: '',
        github: '',
      };
    }
    if (!company.employee2) {
      company.employee2 = {
        name: '',
        title: '',
        bio: '',
        twitter: '',
        github: '',
      };
    }
    if (!company.media1) {
      company.media1 = {url: ''};
    }
    if (!company.media2) {
      company.media2 = {url: ''};
    }
    if (!company.media3) {
      company.media3 = {url: ''};
    }
    let currentAddressDescription =
      company.street_number +
      ' ' +
      company.route +
      ' ' +
      company.locality +
      ', ' +
      company.country;
    currentAddressDescription === 'null null null, null'
      ? (currentAddressDescription = null)
      : null;
    company = {
      skills: company.Skills.map(suggestion => ({
        value: suggestion.Skill,
        label: suggestion.Skill,
      })),
      perks: company.Perks.map(suggestion => ({
        value: suggestion.Perk,
        label: suggestion.Perk,
      })),
      coordinates: {
        lat: company.location ? company.location.coordinates[0] : 0,
        lng: company.location ? company.location.coordinates[1] : 0,
      },
      currentAddressDescription: currentAddressDescription,
      company: company,
      moderators: company.Moderators.map(mod => {
        return mod.userEmail;
      }).join(', '),
      industry: {
        value: company.Industry,
        label: company.Industry,
      },
    };
    delete company['Skills'];
    delete company['Perks'];
    delete company['Moderators'];
    let title = `ReactEurope Jobs - ${company.company.name}`;
    let url;
    req
      ? (url = publicRuntimeConfig.host + req.path)
      : (url = publicRuntimeConfig.host + Router.pathname);
    return {
      translations,
      company,
      companyId,
      userInfo,
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

  handleBlur = (event, required) => {
    this.setState({
      [event.target.name + 'valid']:
        event.target.value || !required ? true : false,
    });
  };

  handleFocus = (event, required) => {
    this.setState({
      [event.target.name + 'valid']: true,
    });
  };

  handleUpdateCallback = () => {
    this.setState({openNotification: true});
  };

  handleChangeIndustry = value => {
    if (value) {
      this.setState({industry: value, industryvalid: true});
    } else {
      this.setState({industry: value, industryvalid: false});
    }
  };

  handleChange = event => {
    this.setState({
      company: {
        ...this.state.company,
        ...{
          [event.target.name]: event.target.value,
        },
      },
    });
  };

  handleModeratorsChange = event => {
    this.setState({
      moderators: event.target.value.split(','),
    });
  };

  handleChangeEmployee1 = event => {
    const employee1 = {
      employee1: {
        ...this.state.company.employee1,
        ...{
          [event.target.name]: event.target.value,
        },
      },
    };
    this.setState({
      company: {
        ...this.state.company,
        ...employee1,
      },
    });
  };

  handleChangeEmployee2 = event => {
    const employee2 = {
      employee2: {
        ...this.state.company.employee2,
        ...{
          [event.target.name]: event.target.value,
        },
      },
    };
    this.setState({
      company: {
        ...this.state.company,
        ...employee2,
      },
    });
  };
  upload = file => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    fetch('/upload', {
      // Your POST endpoint
      method: 'POST',
      headers: {companyId: this.props.companyId},
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
  };

  uploadEmployee1Avatar = file => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    fetch('/uploadEmployee1Avatar', {
      // Your POST endpoint
      method: 'POST',
      headers: {companyId: this.props.companyId},
      body: formData, // This is your file object
    })
      .then(response => {
        response.json(); // if the response is a JSON object
        setTimeout(() => this.setState({employee1Uploaded: new Date()}), 1000);
      })
      .then(
        success => console.log(success), // Handle the success response object
      )
      .catch(
        error => console.log(error), // Handle the error response object
      );
  };

  uploadEmployee2Avatar = file => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    fetch('/uploadEmployee2Avatar', {
      // Your POST endpoint
      method: 'POST',
      headers: {companyId: this.props.companyId},
      body: formData, // This is your file object
    })
      .then(response => {
        response.json(); // if the response is a JSON object
        setTimeout(() => this.setState({employee2Uploaded: new Date()}), 1000);
      })
      .then(
        success => console.log(success), // Handle the success response object
      )
      .catch(
        error => console.log(error), // Handle the error response object
      );
  };

  uploadMedia1Image = file => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    fetch('/uploadMedia1Image', {
      // Your POST endpoint
      method: 'POST',
      headers: {companyId: this.props.companyId},
      body: formData, // This is your file object
    })
      .then(response => {
        response.json(); // if the response is a JSON object
        const company = this.state.company;
        company.media1.hasVideo = false;
        this.setState({media1Uploaded: new Date(), company: company});
        setTimeout(() => this.setState({media1Uploaded: new Date()}), 1000);
      })
      .then(
        success => console.log(success), // Handle the success response object
      )
      .catch(
        error => console.log(error), // Handle the error response object
      );
  };

  uploadMedia2Image = file => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    fetch('/uploadMedia2Image', {
      // Your POST endpoint
      method: 'POST',
      headers: {companyId: this.props.companyId},
      body: formData, // This is your file object
    })
      .then(response => {
        response.json(); // if the response is a JSON object
        const company = this.state.company;
        company.media2.hasVideo = false;
        this.setState({media2Uploaded: new Date(), company: company});
        setTimeout(() => this.setState({media2Uploaded: new Date()}), 1000);
      })
      .then(
        success => console.log(success), // Handle the success response object
      )
      .catch(
        error => console.log(error), // Handle the error response object
      );
  };

  uploadMedia3Image = file => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    fetch('/uploadMedia3Image', {
      // Your POST endpoint
      method: 'POST',
      headers: {companyId: this.props.companyId},
      body: formData, // This is your file object
    })
      .then(response => {
        response.json(); // if the response is a JSON object
        const company = this.state.company;
        company.media3.hasVideo = false;
        this.setState({media3Uploaded: new Date(), company: company});
        setTimeout(() => this.setState({media3Uploaded: new Date()}), 1000);
      })
      .then(
        success => console.log(success), // Handle the success response object
      )
      .catch(
        error => console.log(error), // Handle the error response object
      );
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

  handleChangePerks = value => {
    if (value) {
      this.setState({perks: value, perksvalid: true});
    } else {
      this.setState({
        perks: this.state.perks,
        perksvalid: false,
      });
    }
  };
  saveCompany = () => {
    let newCompany = {
      ...this.state.company,
      ...{Industry: this.state.industry.value},
    };
    const that = this;
    const createCompanyopts = {
      uri: publicRuntimeConfig.hasura,
      json: true,
      query: `mutation update_Company($ownerId: Int!,
                $id: Int!,
    			$name: String!,
			    $url: String!,
			    $description: String!,
			    $yearFounded: Int!,
			    $employeeCount: Int,
			    $devCount: Int,
                $media1: json,
                $media2: json,
                $media3: json,
                $quote1: json,
                $quote2: json,
                $employee1: json,
                $employee2: json,
				$Industry: String!,
                $twitter: String,
               $country: String,
               $route: String,
               $street_number: String,
               $locality: String,
               $administrative_area_level_1: String,
               $postal_code: String,
               $location: geography,
               $skills: [SkillCompany_insert_input!]!
               $perks: [PerkCompany_insert_input!]!
               $moderators: [Moderator_insert_input]
               ) {
				  update_Company(where: {id: {_eq: $id}},_set: {
					ownerId: $ownerId,
					name: $name,
					url: $url,
					description: $description,
					yearFounded: $yearFounded,
					Industry: $Industry,
                    employeeCount: $employeeCount,
                twitter: $twitter,
			    devCount:$devCount,
                media1:$media1,
                media2:$media2,
                media3:$media3,
                quote1:$quote1,
                quote2:$quote2,
                employee1:$employee1,
                employee2:$employee2,
               country: $country,
               route: $route,
               street_number: $street_number,
               locality: $locality,
               administrative_area_level_1: $administrative_area_level_1,
               postal_code: $postal_code,
                location: $location,
				}){
					returning{
					  id
					  name
			}
			}
  delete_SkillCompany(where: {CompanyId: {_eq: $id}}){
    affected_rows

}
		insert_SkillCompany(objects: $skills){
			    returning{Skill}

		}
  delete_PerkCompany(where: {CompanyId: {_eq: $id}}){
    affected_rows

}
		insert_PerkCompany(objects: $perks){
			    returning{Perk}

		}
delete_Moderator(where: {companyId: {_eq: $id}}){
    affected_rows

}
insert_Moderator(objects: $moderators){
    returning{userEmail}
}
			}
				`,
      headers: {
        'x-access-token': Cookies.get('token'),
      },
    };
    let skills = [];
    this.state.skills.map(skill => {
      skills.push({
        Skill: skill.value.Skill || skill.value,
        CompanyId: this.state.company.id,
      });
    });
    newCompany.skills = skills;
    skills.length > 0
      ? null
      : newCompany.skills.push({
          Skill: 'React.js',
          CompanyId: this.state.company.id,
        });
    let perks = [];
    this.state.perks.map(perk => {
      perks.push({
        Perk: perk.value.Perk || perk.value,
        CompanyId: this.state.company.id,
      });
    });
    newCompany.perks = perks;
    perks.length > 0
      ? null
      : newCompany.perks.push({
          Perk: 'Healthcare',
          CompanyId: this.state.company.id,
        });

    let moderators = [];
    let stateModerators = this.state.moderators;
    typeof stateModerators === 'string'
      ? (stateModerators = stateModerators.split(','))
      : null;
    stateModerators.map(moderator => {
      moderator.trim()
        ? moderators.push({
            userEmail: moderator.trim(),
            companyId: this.state.company.id,
          })
        : null;
    });
    newCompany.moderators =
      moderators.length > 0
        ? moderators
        : [
            {
              userEmail: this.state.currentUser.linkedinEmail,
              companyId: this.state.company.id,
            },
          ];
    newCompany = {...newCompany, ...this.state.fullAddress};
    newCompany.location = {
      type: 'Point',
      coordinates: [this.state.coordinates.lat, this.state.coordinates.lng],
    };

    const client = new grequest.GraphQLClient(createCompanyopts.uri, {
      headers: createCompanyopts.headers,
    });

    client.request(createCompanyopts.query, newCompany).then(gdata => {
      this.handleUpdateCallback();
    });
  };

  render(props) {
    const {classes, job} = this.props;
    const i18n = this.i18n;
    const {open} = this.state;
    const company = this.props.company.company;
    const skills = this.props.company.skills;
    const perks = this.props.company.perks;
    return (
      <I18nextProvider i18n={this.i18n}>
        <Head
          title={this.props.title}
          description={company.description}
          url={this.props.url}
          ogImage={
            publicRuntimeConfig.cdn +
            company.id +
            '-' +
            'logo.' +
            ext +
            '?u=' +
            company.updatedAt
          }
        />
        <div>
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
                          aria-label={company.name}
                          src={
                            publicRuntimeConfig.cdn +
                            company.id +
                            '-' +
                            'logo.' +
                            ext +
                            '?u=' +
                            company.updatedAt
                          }
                          className={classes.avatar}
                          style={{borderRadius: 0}}
                        />
                      }
                      title={
                        <Typography gutterBottom variant="h3" component="h1">
                          {company.name}
                        </Typography>
                      }
                      subheader={
                        <>
                          <div className={classes.hideOnMobile}>
                            <span>
                              {i18n.t('Since')} {company.yearFounded}
                            </span>
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
                                {company.locality}
                              </a>
                            </IconButton>
                            <IconButton
                              disableRipple={true}
                              disableFocusRipple={true}
                              className={classes.iconButton}
                              aria-label="Delete">
                              <PeopleIcon className={classes.headerIcons} />{' '}
                              {company.employeeCount} {i18n.t('employees')}
                            </IconButton>
                            <a href={company.url} target="_blank">
                              <IconButton
                                disableRipple={true}
                                disableFocusRipple={true}
                                className={classes.iconButton}
                                aria-label="Delete"
                                style={{cursor: 'pointer'}}>
                                <LinkIcon className={classes.headerIcons} />{' '}
                                {company.url
                                  .replace('http://wwww.', '')
                                  .replace('https://wwww.', '')
                                  .replace('https://', '')
                                  .replace('http://', '')}
                              </IconButton>
                            </a>
                          </div>
                        </>
                      }
                    />
                    <CardActionArea className={classes.cardActionArea}>
                      {company.media1.published ? (
                        <>
                          {company.media1.hasVideo ? (
                            <ReactPlayer
                              url={company.media1.url}
                              width="100%"
                            />
                          ) : (
                            <CardMedia
                              className={classes.media}
                              image={
                                publicRuntimeConfig.cdn +
                                company.id +
                                '-' +
                                '1media.' +
                                ext +
                                '?u=' +
                                company.updatedAt
                              }
                              title={company.name + ' media'}
                            />
                          )}
                        </>
                      ) : null}
                      <CardContent>
                        <Typography component="p">
                          <Markdown>
                            {this.props.lang === 'fr' && company.description_fr
                              ? company.description_fr
                              : company.description}
                          </Markdown>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Link
                          href={
                            '/jobs/companies/' +
                            company.id +
                            '/' +
                            slugify(company.name)
                          }>
                          <Button>{i18n.t('JOBS')}</Button>
                        </Link>
                        <a href={'https://twitter.com/' + company.twitter}>
                          <Button>Twitter</Button>
                        </a>
                      </CardActions>
                    </CardActionArea>
                  </Card>
                  <Card>
                    <CardActionArea>
                      <div className={classes.showOnMobile}>
                        <div>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Founded in">
                            <HistoryIcon className={classes.headerIcons} />{' '}
                            {i18n.t('Since')} {company.yearFounded}
                          </IconButton>
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
                              {company.locality}
                            </a>
                          </IconButton>
                        </div>
                        <div>
                          <IconButton
                            disableRipple={true}
                            disableFocusRipple={true}
                            className={classes.iconButton}
                            aria-label="Employees count">
                            <PeopleIcon className={classes.headerIcons} />{' '}
                            {company.employeeCount} {i18n.t('employees')}
                          </IconButton>
                          <a href={company.url} target="_blank">
                            <IconButton
                              disableRipple={true}
                              disableFocusRipple={true}
                              className={classes.iconButton}
                              aria-label="Company's URL"
                              style={{cursor: 'pointer'}}>
                              <LinkIcon className={classes.headerIcons} />{' '}
                              {company.url
                                .replace('http://wwww.', '')
                                .replace('https://wwww.', '')
                                .replace('https://', '')
                                .replace('http://', '')}
                            </IconButton>
                          </a>
                        </div>
                      </div>
                    </CardActionArea>
                  </Card>
                  {!(
                    company.devCount === 5 &&
                    perks.length === 0 &&
                    skills.length === 0
                  ) ? (
                    <>
                      <Card className={classes.card}>
                        <CardActionArea className={classes.cardActionArea}>
                          <CardContent>
                            <Grid
                              container
                              spacing={24}
                              style={{textAlign: 'center'}}>
                              <Grid item xs={12} md={6}>
                                <Typography component="h3" variant="h3">
                                  {i18n.t('Number of devs')}
                                </Typography>
                                <Typography
                                  component="h1"
                                  variant="h1"
                                  style={{fontSize: '100px'}}>
                                  {company.devCount}
                                </Typography>
                                <LaptopIcon style={{fontSize: '200px'}} />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                style={{background: '#f50057', color: '#fff'}}>
                                <Typography
                                  component="h3"
                                  variant="h4"
                                  style={{marginBottom: '20px'}}>
                                  {i18n.t('Techs we use')}
                                </Typography>
                                {skills.map(skill => (
                                  <Typography
                                    key={skill.value}
                                    variant="h4"
                                    component="h4"
                                    style={{fontSize: '40', textAlign: 'left'}}>
                                    ✓ {skill.value}
                                  </Typography>
                                ))}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                      {company.media2.published ? (
                        <Card className={classes.card}>
                          <CardActionArea className={classes.cardActionArea}>
                            {company.media2.hasVideo ? (
                              <ReactPlayer
                                url={company.media2.url}
                                width="100%"
                              />
                            ) : (
                              <CardMedia
                                className={classes.media}
                                image={
                                  publicRuntimeConfig.cdn +
                                  company.id +
                                  '-' +
                                  '2media.' +
                                  ext +
                                  '?u=' +
                                  company.updatedAt
                                }
                                title={company.name + ' media'}
                              />
                            )}
                          </CardActionArea>
                        </Card>
                      ) : null}
                      <Card className={classes.card}>
                        <CardActionArea className={classes.cardActionArea}>
                          <CardContent>
                            <Grid container spacing={24}>
                              {perks && perks.length > 0 ? (
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  style={{
                                    background: '#4caf50',
                                    color: '#fff',
                                  }}>
                                  <Typography
                                    component="h3"
                                    variant="h4"
                                    style={{marginBottom: '20px'}}>
                                    {i18n.t('Perks we provide')}
                                  </Typography>
                                  {(perks || []).map(perk => (
                                    <Typography
                                      component="h1"
                                      key={perk.label}
                                      variant="h4"
                                      style={{fontSize: 30}}>
                                      ✓ {perk.label}
                                    </Typography>
                                  ))}
                                </Grid>
                              ) : null}
                              {company.employee1.published ? (
                                <Grid item xs={12} md={6}>
                                  <CardHeader
                                    avatar={
                                      <Avatar
                                        aria-label="Recipe"
                                        className={classes.avatar}
                                        src={
                                          publicRuntimeConfig.cdn +
                                          company.id +
                                          '-' +
                                          'employee1avatar.' +
                                          ext +
                                          '?u=' +
                                          company.updatedAt
                                        }
                                      />
                                    }
                                    title={
                                      <>
                                        {company.employee1.name}
                                        {company.employee1.twitter ? (
                                          <a
                                            style={{color: 'black'}}
                                            href={
                                              'https://twitter.com/' +
                                              company.employee1.twitter
                                            }>
                                            <TwitterCircle />
                                          </a>
                                        ) : null}
                                        {company.employee1.github ? (
                                          <a
                                            style={{color: 'black'}}
                                            href={
                                              'https://github.com/' +
                                              company.employee1.github
                                            }>
                                            <GithubCircle />
                                          </a>
                                        ) : null}
                                      </>
                                    }
                                    subheader={<>{company.employee1.title}</>}
                                  />
                                  <Typography component="p">
                                    {company.employee1.bio}
                                  </Typography>
                                </Grid>
                              ) : null}
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>

                      {company.media3.published ? (
                        <Card className={classes.card}>
                          <CardActionArea className={classes.cardActionArea}>
                            {company.media3.hasVideo ? (
                              <ReactPlayer
                                url={company.media3.url}
                                width="100%"
                              />
                            ) : (
                              <CardMedia
                                className={classes.media}
                                image={
                                  publicRuntimeConfig.cdn +
                                  company.id +
                                  '-' +
                                  '3media.' +
                                  ext +
                                  '?u=' +
                                  company.updatedAt
                                }
                                title={company.name + ' media'}
                              />
                            )}
                          </CardActionArea>
                        </Card>
                      ) : null}
                      {company.employee2.published ? (
                        <Card className={classes.card}>
                          <CardActionArea className={classes.cardActionArea}>
                            <CardContent>
                              <Grid container spacing={24}>
                                <Grid item xs={12} md={12}>
                                  <CardHeader
                                    avatar={
                                      <Avatar
                                        aria-label="Recipe"
                                        className={classes.avatar}
                                        src={
                                          publicRuntimeConfig.cdn +
                                          company.id +
                                          '-' +
                                          'employee2avatar.' +
                                          ext +
                                          '?u=' +
                                          company.updatedAt
                                        }
                                      />
                                    }
                                    title={
                                      <>
                                        {company.employee2.name}
                                        {company.employee2.twitter ? (
                                          <a
                                            style={{color: 'black'}}
                                            href={
                                              'https://twitter.com/' +
                                              company.employee2.twitter
                                            }>
                                            <TwitterCircle />
                                          </a>
                                        ) : null}
                                        {company.employee2.github ? (
                                          <a
                                            style={{color: 'black'}}
                                            href={
                                              'https://github.com/' +
                                              company.employee2.github
                                            }>
                                            <GithubCircle />
                                          </a>
                                        ) : null}
                                      </>
                                    }
                                    subheader={<>{company.employee2.title}</>}
                                  />
                                  <Typography component="p">
                                    {company.employee2.bio}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </I18nextProvider>
    );
  }
}
ShowCompany.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(ShowCompany));
