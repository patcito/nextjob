/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');
import getConfig from 'next/config';
import {getHasuraHost} from '../lib/getHasuraHost';
import Head from '../components/head';

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

import INDUSTRIES from '../data/industries';
import JOBSTITLES from '../data/jobstitles';
import JOBFUNCTIONS from '../data/jobfunctions';
import EMPLOYEMENTTYPES from '../data/employementtypes';
import SENIORITYLEVELS from '../data/senioritylevels';
import SKILLS from '../data/skills';

import DownshiftSelect from '../components/downshift';
import MultipleDownshiftSelect from '../components/multipledownshift';

import dynamic from 'next/dynamic';

import Router from 'next/router';

import DynamicMaps from '../components/maps';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import PlaceIcon from '@material-ui/icons/Place';
import PeopleIcon from '@material-ui/icons/People';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import WorkIcon from '@material-ui/icons/Work';

import Cookies from 'js-cookie';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import ReactPlayer from 'react-player';
import ReactTimeout from 'react-timeout';
import PERKS from '../data/perks';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

const PlacesSelect = dynamic(import('../components/placesselect'), {
  ssr: false,
});
import {withRouter} from 'next/router';
import Slider, {Range} from 'rc-slider';
import Tooltip from 'rc-tooltip';

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
});

class EditCompany extends React.Component {
  state = {
    open: false,
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
      Skills: [],
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
    let forceFr = query.fr;
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
        'editcompany',
        'perks',
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
      req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      github = req.github;
      linkedin = req.linkedin;

      userInfo = {
        userId: userId,
        token: token,
        github: github,
        linkedin: linkedin,
        githubEmail: req.githubEmail,
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
      uri: getHasuraHost(process, req, publicRuntimeConfig),
      json: true,
      query: `
        query JobCompanies($userId: Int, $ownerId: Int, $companyId: Int) {
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
          Company(
            where: {_and: [{id: {_eq: $companyId}}]}
          ) {
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
    let company = await client.request(queryOpts.query, {
      ownerId: userId,
      userId: userInfo.userId,
      companyId: companyId,
    });
    let companiesCount = company.Company_aggregate;

    if (company.Company.length > 0) {
      company = company.Company[0];
    } else {
      company = null;
    }
    if (!company.devCount) {
      company.devCount = 5;
    }
    return {
      translations,
      company,
      companyId,
      userInfo,
      lang,
      forceFr,
      companiesCount,
    };
  }
  constructor(props) {
    super(props);
    this.i18n = startI18n(props.translations, this.props.lang);
    this.INDUSTRIES = INDUSTRIES.map(suggestion => ({
      value: suggestion.industry,
      label: this.i18n.t('industries:' + suggestion.industry),
    }));
    this.SKILLS = SKILLS.map(suggestion => ({
      value: suggestion.name,
      label: suggestion.name,
    }));
    this.PERKS = PERKS.map(suggestion => ({
      value: suggestion.title,
      label: this.i18n.t('perks:' + suggestion.title),
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
    const company = this.props.company;
    company.Moderators === []
      ? (company.Moderators = [{userEmail: user.linkedinEmail}])
      : null;
    /*alert(
          JSON.stringify({
            industry: {
              value: company.Industry,
              label: this.props.i18n.t('industries:' + company.Industry),
            },
          }),
        );*/
    if (!company.Perks) {
      company.Perks = [];
    }
    if (!company.Moderators) {
      company.Moderators = [];
    }

    if (!company.Skills) {
      company.Skills = [];
    }
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
      company.street_number || company.route || company.locality
        ? company.street_number +
          ' ' +
          company.route +
          ' ' +
          company.locality +
          ', ' +
          company.country
        : company.country;
    currentAddressDescription === 'null null null, null'
      ? (currentAddressDescription = null)
      : null;
    this.setState({
      currentUser: user,
      skills: company.Skills.map(suggestion => ({
        value: suggestion.Skill,
        label: suggestion.Skill,
      })),
      perks: company.Perks.map(suggestion => ({
        value: suggestion.Perk,
        label: this.i18n.t('perks:' + suggestion.Perk),
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
        label: this.i18n.t('industries:' + company.Industry),
      },
    });
    delete company['Skills'];
    delete company['Perks'];
    delete company['Moderators'];
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

  handleCheckboxChangeEmployee1 = event => {
    const employee1 = {
      employee1: {
        ...this.state.company.employee1,
        ...{
          published: !this.state.company.employee1.published,
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

  handleCheckboxChangeEmployee2 = event => {
    const employee2 = {
      employee2: {
        ...this.state.company.employee2,
        ...{
          published: !this.state.company.employee2.published,
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

  handleCheckboxChangeMedia1 = event => {
    const media1 = {
      media1: {
        ...this.state.company.media1,
        ...{
          published: !this.state.company.media1.published,
        },
      },
    };
    this.setState({
      company: {
        ...this.state.company,
        ...media1,
      },
    });
  };

  handleCheckboxChangeMedia2 = event => {
    const media2 = {
      media2: {
        ...this.state.company.media2,
        ...{
          published: !this.state.company.media2.published,
        },
      },
    };
    this.setState({
      company: {
        ...this.state.company,
        ...media2,
      },
    });
  };

  handleCheckboxChangeMedia3 = event => {
    const media3 = {
      media3: {
        ...this.state.company.media3,
        ...{
          published: !this.state.company.media3.published,
        },
      },
    };
    this.setState({
      company: {
        ...this.state.company,
        ...media3,
      },
    });
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
      .then(success => {
        console.log(success); // Handle the success response object
        this.touchCompany();
      })
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
        setTimeout(() => this.setState({employee1Uploaded: new Date()}), 4000);
      })
      .then(
        success => {
          console.log(success);
          this.touchCompany();
        }, // Handle the success response object
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
        setTimeout(() => this.setState({employee2Uploaded: new Date()}), 4000);
      })
      .then(
        success => {
          console.log(success);
          this.touchCompany();
        }, // Handle the success response object
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
        setTimeout(() => this.setState({media1Uploaded: new Date()}), 4000);
      })
      .then(success => {
        console.log(success); // Handle the success response object
        this.touchCompany();
      })
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
        setTimeout(() => this.setState({media2Uploaded: new Date()}), 4000);
      })
      .then(
        success => {
          this.touchCompany();
          console.log(success);
        }, // Handle the success response object
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
        setTimeout(() => this.setState({media3Uploaded: new Date()}), 4000);
      })
      .then(
        success => {
          this.touchCompany();
          console.log(success);
        }, // Handle the success response object
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
  touchCompany = () => {
    const createCompanyopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
        mutation update_Company($updatedAt: timestamptz, $id: Int) {
          update_Company(
            where: {id: {_eq: $id}}
            _set: {updatedAt: $updatedAt}
          ) {
            returning {
              id
              name
              updatedAt
            }
          }
        }
      `,
      headers: {
        'x-access-token': Cookies.get('token'),
      },
    };
    const client = new grequest.GraphQLClient(createCompanyopts.uri, {
      headers: createCompanyopts.headers,
    });

    client
      .request(createCompanyopts.query, {
        id: this.state.company.id,
        updatedAt: 'now',
      })
      .then(gdata => {});
  };

  saveCompany = () => {
    let newCompany = {
      ...this.state.company,
      ...{Industry: this.state.industry.value},
    };
    const that = this;
    const createCompanyopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `
        mutation update_Company(
          $ownerId: Int!
          $id: Int!
          $name: String!
          $url: String!
          $description: String!
          $description_fr: String!
          $yearFounded: Int!
          $updatedAt: timestamptz
          $employeeCount: Int
          $devCount: Int
          $media1: json
          $media2: json
          $media3: json
          $quote1: json
          $quote2: json
          $employee1: json
          $employee2: json
          $Industry: String!
          $twitter: String
          $country: String
          $route: String
          $street_number: String
          $locality: String
          $administrative_area_level_1: String
          $postal_code: String
          $location: geography
          $skills: [SkillCompany_insert_input!]!
          $perks: [PerkCompany_insert_input!]!
          $moderators: [Moderator_insert_input!]!
        ) {
          update_Company(
            where: {id: {_eq: $id}}
            _set: {
              ownerId: $ownerId
              name: $name
              url: $url
              description: $description
              description_fr: $description_fr
              yearFounded: $yearFounded
              Industry: $Industry
              employeeCount: $employeeCount
              twitter: $twitter
			  updatedAt: $updatedAt
              devCount: $devCount
              media1: $media1
              media2: $media2
              media3: $media3
              quote1: $quote1
              quote2: $quote2
              employee1: $employee1
              employee2: $employee2
              country: $country
              route: $route
              street_number: $street_number
              locality: $locality
              administrative_area_level_1: $administrative_area_level_1
              postal_code: $postal_code
              location: $location
            }
          ) {
            returning {
              id
              name
            }
          }
          delete_SkillCompany(where: {CompanyId: {_eq: $id}}) {
            affected_rows
          }
          insert_SkillCompany(objects: $skills) {
            returning {
              Skill
            }
          }
          delete_PerkCompany(where: {CompanyId: {_eq: $id}}) {
            affected_rows
          }
          insert_PerkCompany(objects: $perks) {
            returning {
              Perk
            }
          }
          insert_Moderator(objects: $moderators,on_conflict: {
            update_columns: [],
            constraint: Moderator_pkey
          }){
            returning {
              userEmail
            }
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
    const industries = this.INDUSTRIES;
    const skills = this.SKILLS;
    const perks = this.PERKS;
    let title = this.i18n.t('ReactEurope Jobs - Edit Company');
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <Head title={title} />
          {typeof google === 'undefined' ? (
            <DynamicMaps
              setGoogleMaps={() => {
                this.setState({googleMaps: true});
              }}
            />
          ) : null}
          <NewJobBar
            i18n={this.i18n}
            userInfo={this.props.userInfo}
            companyCount={this.props.companiesCount}
          />
          <div style={{paddingLeft: 12, paddingRight: 16}}>
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
                  <form>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.namevalid === false}>
                      <InputLabel htmlFor="name-simple">
                        {i18n.t('Name')}
                      </InputLabel>
                      <Input
                        id="name-simple"
                        name="name"
                        value={this.state.company.name}
                        onChange={this.handleChange}
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        required={true}
                      />
                      <FormHelperText
                        id={
                          this.state.namevalid !== false
                            ? 'name-helper-text'
                            : 'name-error-text'
                        }>
                        {this.state.namevalid !== false
                          ? i18n.t("Your company's name")
                          : i18n.t("Your company's name is required")}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.urlvalid === false}
                      aria-describedby="url-text">
                      <InputLabel htmlFor="url">{i18n.t('URL')}</InputLabel>
                      <Input
                        id="url"
                        value={this.state.company.url}
                        name="url"
                        required={true}
                        type="url"
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        onChange={this.handleChange}
                      />
                      <FormHelperText
                        id={
                          this.state.urlvalid !== false
                            ? 'url-helper-text'
                            : 'url-error-text'
                        }>
                        {this.state.urlvalid !== false
                          ? i18n.t("Your company's website")
                          : i18n.t("Your company's website is required")}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.company.yearFoundedvalid === false}>
                      <InputLabel htmlFor="yearFounded">
                        {i18n.t('Year founded')}
                      </InputLabel>
                      <Input
                        id="yearFounded"
                        name="yearFounded"
                        value={this.state.company.yearFounded}
                        onChange={this.handleChange}
                        required={true}
                        min={1900}
                        placeholder="2018"
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        type="number"
                      />
                      <FormHelperText
                        id={
                          this.state.yearFoundedvalid !== false
                            ? 'yearFounded-helper-text'
                            : 'yearFounded-error-text'
                        }>
                        {this.state.yearFoundedvalid !== false
                          ? i18n.t('The year your company was founded')
                          : i18n.t(
                              'The year your company was founded is required',
                            )}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.industryvalid === false}>
                      <DownshiftSelect
                        i18n={i18n}
                        suggestions={industries}
                        selectedItem={this.state.industry}
                        handleParentChange={this.handleChangeIndustry}
                        name="industry"
                        id="jobIndustry"
                        required={true}
                      />
                      <FormHelperText
                        id={
                          this.state.industryvalid !== false
                            ? 'industry-helper-text'
                            : 'industry-error-text'
                        }>
                        {this.state.industryvalid !== false
                          ? i18n.t("Select your company's industry")
                          : i18n.t(
                              "Selecting your company's industry is required",
                            )}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.employeeCountvalid === false}>
                      <InputLabel htmlFor="employeeCount">
                        {i18n.t('Employee count')}
                      </InputLabel>
                      <Input
                        id="employeeCount"
                        name="employeeCount"
                        value={this.state.company.employeeCount}
                        onChange={this.handleChange}
                        required={true}
                        min={0}
                        placeholder="1"
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        type="number"
                      />
                      <FormHelperText
                        id={
                          this.state.employeeCountvalid !== false
                            ? 'employeeCount-helper-text'
                            : 'employeeCount-error-text'
                        }>
                        {this.state.employeeCountvalid !== false
                          ? i18n.t('editcompany:How many employees do you have')
                          : i18n.t('This field is required')}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.company.twittervalid === false}>
                      <TextField
                        label="Twitter"
                        name="twitter"
                        onChange={this.handleChange}
                        value={this.state.company.twitter}
                        id="twitter"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">@</InputAdornment>
                          ),
                        }}
                      />
                      <FormHelperText
                        id={
                          this.state.twittervalid !== false
                            ? 'twitter-helper-text'
                            : 'twitter-error-text'
                        }>
                        {this.state.twittervalid !== false
                          ? i18n.t("editcompany:Your company's Twitter account")
                          : i18n.t('This field is required')}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.company.devCountvalid === false}>
                      <InputLabel htmlFor="devCount">
                        {i18n.t('Dev count')}
                      </InputLabel>
                      <Input
                        id="devCount"
                        name="devCount"
                        value={this.state.company.devCount}
                        onChange={this.handleChange}
                        required={true}
                        min={0}
                        placeholder="1"
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        type="number"
                      />
                      <FormHelperText
                        id={
                          this.state.devCountvalid !== false
                            ? 'devCount-helper-text'
                            : 'devCount-error-text'
                        }>
                        {this.state.devCountvalid !== false
                          ? i18n.t(
                              'editcompany:How many developers do you have',
                            )
                          : i18n.t('This field is required')}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.namevalid === false}>
                      <InputLabel htmlFor="name-simple">
                        {i18n.t('Logo')}
                      </InputLabel>
                      <Input
                        id="logo-simple"
                        onChange={this.upload}
                        name="file"
                        type="file"
                      />
                      <FormHelperText
                        id={
                          this.state.namevalid !== false
                            ? 'name-helper-text'
                            : 'name-error-text'
                        }>
                        {this.state.namevalid !== false
                          ? i18n.t("Your company's logo")
                          : i18n.t("Your company's logo is required")}
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth={true}>
                      {this.state.googleMaps ||
                      typeof google !== 'undefined' ? (
                        <PlacesSelect
                          i18n={this.i18n}
                          placeholder={
                            this.state.currentAddressDescription ||
                            this.i18n.t(
                              'updatecompany:Where is your company located?',
                            )
                          }
                          that={this}
                        />
                      ) : null}
                    </FormControl>

                    <FormControl
                      fullWidth={true}
                      className={classes.formControl}
                      error={this.state.company.descriptionvalid === false}>
                      <InputLabel htmlFor="name-simple">
                        {i18n.t('Description')}
                      </InputLabel>
                      <Input
                        id="description"
                        value={this.state.company.description}
                        onChange={this.handleChange}
                        name="description"
                        required={true}
                        multiline={true}
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        rows={5}
                        fullWidth={true}
                      />

                      <FormHelperText
                        id={
                          this.state.descriptionvalid !== false
                            ? 'description-helper-text'
                            : 'description-error-text'
                        }>
                        {this.state.descriptionvalid !== false
                          ? i18n.t(
                              'Write a description about what your company is about',
                            )
                          : i18n.t(
                              'Writing a description about what your company is about is required',
                            )}
                      </FormHelperText>
                      {this.props.lang === 'fr' || this.props.forceFr === 1 ? (
                        <>
                          <Input
                            id="description_fr"
                            value={this.state.company.description_fr}
                            onChange={this.handleChange}
                            name="description_fr"
                            multiline={true}
                            onBlur={e => this.handleBlur(e, true)}
                            onFocus={e => this.handleFocus(e, true)}
                            rows={5}
                            fullWidth={true}
                          />
                          <FormHelperText
                            id={
                              this.state.description_frvalid !== false
                                ? 'description_fr-helper-text'
                                : 'description_fr-error-text'
                            }>
                            {this.state.description_frvalid !== false
                              ? this.i18n.t(
                                  'Write a description about what your company is about in French',
                                )
                              : this.i18n.t(
                                  'Writing a description about what your company is about is required',
                                )}
                          </FormHelperText>
                        </>
                      ) : null}
                    </FormControl>
                    <FormControl
                      className={classes.formControl}
                      error={this.state.namevalid === false}>
                      <InputLabel htmlFor="moderators">
                        {i18n.t('editcompany:Moderators')}
                      </InputLabel>
                      <Input
                        id="moderators"
                        name="moderators"
                        value={this.state.moderators}
                        onChange={this.handleModeratorsChange}
                        onBlur={e => this.handleBlur(e, true)}
                        onFocus={e => this.handleFocus(e, true)}
                        placeholder="a@company.com, b@company.com"
                        required={true}
                      />
                      <FormHelperText
                        id={
                          this.state.namevalid !== false
                            ? 'name-helper-text'
                            : 'name-error-text'
                        }>
                        {i18n.t(
                          'editcompany:List emails of people who can add and modify jobs, these people must already have an account before they can be added',
                        )}
                      </FormHelperText>
                    </FormControl>

                    {this.state.company.name ? (
                      <>
                        <FormControl
                          fullWidth={true}
                          className={classes.formControl}>
                          <MultipleDownshiftSelect
                            i18n={i18n}
                            suggestions={skills}
                            selectedItems={this.state.skills}
                            label={i18n.t(
                              'editcompany:List the techs being used at your company',
                            )}
                            placeholder={i18n.t(
                              'editcompany:Select multiple techs (up to 25)',
                            )}
                            handleParentChange={this.handleChangeSkills}
                            name="skills"
                            id="skills"
                            maxSelection={25}
                            required={true}
                          />
                          <FormHelperText>
                            {i18n.t(
                              'newjob:Select skills required for the job',
                            )}
                          </FormHelperText>
                        </FormControl>
                        <FormControl
                          fullWidth={true}
                          className={classes.formControl}>
                          <MultipleDownshiftSelect
                            i18n={i18n}
                            suggestions={perks}
                            selectedItems={this.state.perks}
                            label={i18n.t(
                              'editcompany:List perks available at your company',
                            )}
                            placeholder={i18n.t(
                              'editcompany:Select multiple perks',
                            )}
                            handleParentChange={this.handleChangePerks}
                            name="perks"
                            id="perks"
                            maxSelection={40}
                            required={true}
                          />
                          <FormHelperText>
                            {i18n.t(
                              'editcompany:Select perks your company offers',
                            )}
                          </FormHelperText>
                        </FormControl>
                      </>
                    ) : null}
                    {this.state.company.employee1 ? (
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography
                            className={classes.title}
                            color="textSecondary">
                            {i18n.t('editcompany:Featured employee #1')}
                          </Typography>
                          <Typography component="h2">
                            {i18n.t(
                              'editcompany:Add details about an employee you think could encourage people to work at your company',
                            )}
                          </Typography>
                          <Avatar
                            src={
                              publicRuntimeConfig.cdn +
                              this.state.company.id +
                              '-' +
                              'employee1avatar.png?u=' +
                              this.state.employee1Uploaded +
                              this.state.company.updatedAt
                            }
                            style={{cursor: 'pointer'}}
                            onClick={() => this.fileInput.click()}
                          />
                          <input
                            style={{display: 'none'}}
                            ref={fileInput => (this.fileInput = fileInput)}
                            type="file"
                            onChange={this.uploadEmployee1Avatar}
                          />
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="name-simple">
                              {i18n.t("editcompany:Employee's Name")}
                            </InputLabel>
                            <Input
                              id="name-simple"
                              name="name"
                              value={this.state.company.employee1.name}
                              onChange={this.handleChangeEmployee1}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.namevalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {this.state.namevalid !== false
                                ? i18n.t("editcompany:Your employee's name")
                                : i18n.t(
                                    "editcompany:Your employee's name is required",
                                  )}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="title-simple">
                              {i18n.t("editcompany:Employee's title")}
                            </InputLabel>
                            <Input
                              id="title-simple"
                              name="title"
                              value={this.state.company.employee1.title}
                              onChange={this.handleChangeEmployee1}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.titlevalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {i18n.t("editcompany:Your employee's title")}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="name-simple">
                              {i18n.t("editcompany:Employee's Twitter")}
                            </InputLabel>
                            <Input
                              id="twitter-simple"
                              name="twitter"
                              value={this.state.company.employee1.twitter}
                              onChange={this.handleChangeEmployee1}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.twittervalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {i18n.t("editcompany:Your employee's twitter")}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="name-simple">
                              {i18n.t("editcompany:Employee's Github")}
                            </InputLabel>
                            <Input
                              id="github-simple"
                              name="github"
                              value={this.state.company.employee1.github}
                              onChange={this.handleChangeEmployee1}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.githubvalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {i18n.t("editcompany:Your employee's github")}
                            </FormHelperText>
                          </FormControl>

                          <FormControl
                            fullWidth={true}
                            className={classes.formControl}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    this.state.company.employee1.published
                                  }
                                  name="published"
                                  value="published"
                                  onChange={this.handleCheckboxChangeEmployee1}
                                  color="primary"
                                />
                              }
                              label={this.i18n.t('newjob:Publish')}
                            />
                          </FormControl>

                          <FormControl
                            fullWidth={true}
                            className={classes.formControl}
                            error={this.state.company.biovalid === false}>
                            <InputLabel htmlFor="bio-simple">
                              {i18n.t('Bio')}
                            </InputLabel>
                            <Input
                              id="bio"
                              value={this.state.company.employee1.bio}
                              onChange={this.handleChangeEmployee1}
                              name="bio"
                              required={true}
                              multiline={true}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              rows={5}
                              fullWidth={true}
                            />

                            <FormHelperText
                              id={
                                this.state.biovalid !== false
                                  ? 'bio-helper-text'
                                  : 'bio-error-text'
                              }>
                              {this.state.biovalid !== false
                                ? i18n.t(
                                    'editcompany:Write a bio about your employee and what they do',
                                  )
                                : i18n.t('editcompany:A bio is required')}
                            </FormHelperText>
                          </FormControl>
                        </CardContent>
                      </Card>
                    ) : null}
                    {this.state.company.employee2 ? (
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography
                            className={classes.title}
                            color="textSecondary">
                            {i18n.t('editcompany:Featured employee #2')}
                          </Typography>
                          <Typography component="h2">
                            {i18n.t(
                              'editcompany:Add details about an employee you think could encourage people to work at your company',
                            )}
                          </Typography>
                          <Avatar
                            style={{cursor: 'pointer'}}
                            src={
                              publicRuntimeConfig.cdn +
                              this.state.company.id +
                              '-' +
                              'employee2avatar.png?u=' +
                              this.state.employee2Uploaded +
                              this.state.company.updatedAt
                            }
                            className={classes.avatar}
                            onClick={() => this.fileInput2.click()}
                          />
                          <input
                            style={{display: 'none'}}
                            ref={fileInput2 => (this.fileInput2 = fileInput2)}
                            type="file"
                            onChange={this.uploadEmployee2Avatar}
                          />
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="name-simple">
                              {i18n.t("editcompany:Employee's Name")}
                            </InputLabel>
                            <Input
                              id="name-simple"
                              name="name"
                              value={this.state.company.employee2.name}
                              onChange={this.handleChangeEmployee2}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.namevalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {this.state.namevalid !== false
                                ? i18n.t("editcompany:Your employee's name")
                                : i18n.t(
                                    "editcompany:Your employee's name is required",
                                  )}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="title-simple">
                              {i18n.t("editcompany:Employee's title")}
                            </InputLabel>
                            <Input
                              id="title-simple"
                              name="title"
                              value={this.state.company.employee2.title}
                              onChange={this.handleChangeEmployee2}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.titlevalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {i18n.t("editcompany:Your employee's title")}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="name-simple">
                              {i18n.t("editcompany:Employee's Twitter")}
                            </InputLabel>
                            <Input
                              id="twitter-simple"
                              name="twitter"
                              value={this.state.company.employee2.twitter}
                              onChange={this.handleChangeEmployee2}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.twittervalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {i18n.t("editcompany:Your employee's twitter")}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            className={classes.formControl}
                            error={this.state.namevalid === false}>
                            <InputLabel htmlFor="name-simple">
                              {i18n.t("editcompany:Employee's Github")}
                            </InputLabel>
                            <Input
                              id="github-simple"
                              name="github"
                              value={this.state.company.employee2.github}
                              onChange={this.handleChangeEmployee2}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              required={true}
                            />
                            <FormHelperText
                              id={
                                this.state.githubvalid !== false
                                  ? 'name-helper-text'
                                  : 'name-error-text'
                              }>
                              {i18n.t("editcompany:Your employee's github")}
                            </FormHelperText>
                          </FormControl>

                          <FormControl
                            fullWidth={true}
                            className={classes.formControl}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    this.state.company.employee2.published
                                  }
                                  name="published"
                                  value="published"
                                  onChange={this.handleCheckboxChangeEmployee2}
                                  color="primary"
                                />
                              }
                              label={this.i18n.t('newjob:Publish')}
                            />
                          </FormControl>

                          <FormControl
                            fullWidth={true}
                            className={classes.formControl}
                            error={this.state.company.biovalid === false}>
                            <InputLabel htmlFor="bio-simple">
                              {i18n.t('Bio')}
                            </InputLabel>
                            <Input
                              id="bio"
                              value={this.state.company.employee2.bio}
                              onChange={this.handleChangeEmployee2}
                              name="bio"
                              required={true}
                              multiline={true}
                              onBlur={e => this.handleBlur(e, true)}
                              onFocus={e => this.handleFocus(e, true)}
                              rows={5}
                              fullWidth={true}
                            />

                            <FormHelperText
                              id={
                                this.state.biovalid !== false
                                  ? 'bio-helper-text'
                                  : 'bio-error-text'
                              }>
                              {this.state.biovalid !== false
                                ? i18n.t(
                                    'editcompany:Write a bio about your employee and what they do',
                                  )
                                : i18n.t('editcompany:A bio is required')}
                            </FormHelperText>
                          </FormControl>
                        </CardContent>
                      </Card>
                    ) : null}
                    <Card className={classes.card}>
                      <CardHeader
                        title={i18n.t(
                          'editcompany:Add an image or video to your profile',
                        )}
                      />

                      <CardActionArea className={classes.cardActionArea}>
                        {this.state.company.media1.hasVideo ? (
                          <ReactPlayer url={this.state.company.media1.url} />
                        ) : (
                          <CardMedia
                            className={classes.media}
                            image={
                              publicRuntimeConfig.cdn +
                              this.state.company.id +
                              '-' +
                              '1media.png?u=' +
                              this.state.media1Uploaded +
                              this.state.company.updatedAt
                            }
                            title="Contemplative Reptile"
                            onClick={() => this.media1FileInput.click()}
                          />
                        )}
                      </CardActionArea>
                      <CardActions>
                        <input
                          style={{display: 'none'}}
                          ref={media1FileInput =>
                            (this.media1FileInput = media1FileInput)
                          }
                          type="file"
                          onChange={this.uploadMedia1Image}
                        />
                        <TextField
                          id="standard-bare"
                          value={this.state.company.media1.url}
                          placeholder={i18n.t(
                            'editcompany:Paste your video URL here',
                          )}
                          margin="normal"
                          onChange={e => {
                            const company = this.state.company;
                            company.media1.url = e.target.value;
                            this.setState({company: company});
                          }}
                        />
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            if (this.state.company.media1.url) {
                              const company = this.state.company;
                              company.media1.hasVideo = true;
                              this.setState({company: company});
                            }
                          }}>
                          {i18n.t('editcompany:video')}
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.media1FileInput.click()}>
                          {i18n.t('editcompany:image')}
                        </Button>

                        <FormControl className={classes.formControl}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.company.media1.published}
                                name="published"
                                value="published"
                                onChange={this.handleCheckboxChangeMedia1}
                                color="primary"
                              />
                            }
                            label={this.i18n.t('newjob:Publish')}
                          />
                        </FormControl>
                      </CardActions>
                    </Card>

                    <Card className={classes.card}>
                      <CardHeader
                        title={i18n.t(
                          'editcompany:Add a second image or video to your profile',
                        )}
                      />

                      <CardActionArea className={classes.cardActionArea}>
                        {this.state.company.media2.hasVideo ? (
                          <ReactPlayer url={this.state.company.media2.url} />
                        ) : (
                          <CardMedia
                            className={classes.media}
                            image={
                              publicRuntimeConfig.cdn +
                              this.state.company.id +
                              '-' +
                              '2media.png?u=' +
                              this.state.media2Uploaded +
                              this.state.company.updatedAt
                            }
                            title="Contemplative Reptile"
                            onClick={() => this.media2FileInput.click()}
                          />
                        )}
                      </CardActionArea>
                      <CardActions>
                        <input
                          style={{display: 'none'}}
                          ref={media2FileInput =>
                            (this.media2FileInput = media2FileInput)
                          }
                          type="file"
                          onChange={this.uploadMedia2Image}
                        />
                        <TextField
                          id="standard-bare"
                          value={this.state.company.media2.url}
                          placeholder={i18n.t(
                            'editcompany:Paste your video URL here',
                          )}
                          margin="normal"
                          onChange={e => {
                            const company = this.state.company;
                            company.media2.url = e.target.value;
                            this.setState({company: company});
                          }}
                        />
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            if (this.state.company.media2.url) {
                              const company = this.state.company;
                              company.media2.hasVideo = true;
                              this.setState({company: company});
                            }
                          }}>
                          {i18n.t('editcompany:video')}
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.media2FileInput.click()}>
                          {i18n.t('editcompany:image')}
                        </Button>

                        <FormControl className={classes.formControl}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.company.media2.published}
                                name="published"
                                value="published"
                                onChange={this.handleCheckboxChangeMedia2}
                                color="primary"
                              />
                            }
                            label={this.i18n.t('newjob:Publish')}
                          />
                        </FormControl>
                      </CardActions>
                    </Card>

                    <Card className={classes.card}>
                      <CardHeader
                        title={i18n.t(
                          'editcompany:Add a third image or video to your profile',
                        )}
                      />
                      <CardActionArea className={classes.cardActionArea}>
                        {this.state.company.media3.hasVideo ? (
                          <ReactPlayer url={this.state.company.media3.url} />
                        ) : (
                          <CardMedia
                            className={classes.media}
                            image={
                              publicRuntimeConfig.cdn +
                              this.state.company.id +
                              '-' +
                              '3media.png?u=' +
                              this.state.media3Uploaded +
                              this.state.company.updatedAt
                            }
                            title="Contemplative Reptile"
                            onClick={() => this.media3FileInput.click()}
                          />
                        )}
                      </CardActionArea>
                      <CardActions>
                        <input
                          style={{display: 'none'}}
                          ref={media3FileInput =>
                            (this.media3FileInput = media3FileInput)
                          }
                          type="file"
                          onChange={this.uploadMedia3Image}
                        />
                        <TextField
                          id="standard-bare"
                          value={this.state.company.media3.url}
                          placeholder={i18n.t(
                            'editcompany:Paste your video URL here',
                          )}
                          margin="normal"
                          onChange={e => {
                            const company = this.state.company;
                            company.media3.url = e.target.value;
                            this.setState({company: company});
                          }}
                        />
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            if (this.state.company.media3.url) {
                              const company = this.state.company;
                              company.media3.hasVideo = true;
                              this.setState({company: company});
                            }
                          }}>
                          {i18n.t('editcompany:video')}
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => this.media3FileInput.click()}>
                          {i18n.t('editcompany:image')}
                        </Button>

                        <FormControl className={classes.formControl}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.company.media3.published}
                                name="published"
                                value="published"
                                onChange={this.handleCheckboxChangeMedia3}
                                color="primary"
                              />
                            }
                            label={this.i18n.t('newjob:Publish')}
                          />
                        </FormControl>
                      </CardActions>
                    </Card>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.saveCompany}
                      className={classes.button}>
                      {i18n.t('Save')}
                    </Button>
                  </form>
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
                        {this.i18n.t('Company updated')}
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
              </Grid>
            </Grid>
          </div>
        </div>
      </I18nextProvider>
    );
  }
}
EditCompany.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(EditCompany));
