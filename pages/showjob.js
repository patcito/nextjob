/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import AppBarTop from '../components/appbar';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');

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
import {TwitterCircle, GithubCircle} from 'mdi-material-ui';
import {withRouter} from 'next/router';
import Slider, {Range} from 'rc-slider';
import Tooltip from 'rc-tooltip';
import CardHeader from '@material-ui/core/CardHeader';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import 'rc-slider/assets/index.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const TooltipRange = createSliderWithTooltip(Range);

// get language from query parameter or url path
const lang = 'fr';
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
});

class ShowJob extends React.Component {
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
    const jobId = query.jobId || null;
    if (req) {
      query.me && req.userId ? (userId = req.userId) : (userId = null);
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
    }
    const queryOpts = {
      uri: 'http://localhost:8080/v1alpha1/graphql',
      json: true,
      query: `query JobCompanies($id: Int){
              Job(where: {id: {_eq: $id}}){
                                id
                      description
                      Industry
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
                  Company {
                            id
                            name
                      Perks {
                                  Perk

                      }
                      Skills {
                                  Skill

                      }

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
                      applicationEmail
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
        'X-Hasura-Access-Key': process.env.HASURA_SECRET,
      },
    };
    const client = new grequest.GraphQLClient(queryOpts.uri, {
      headers: queryOpts.headers,
    });
    let job = await client.request(queryOpts.query, {
      id: jobId,
    });

    if (job.Job.length > 0) {
      job = job.Job[0];
    } else {
      job = null;
    }
    return {translations, jobId, userInfo};
  }
  constructor(props) {
    super(props);
    this.i18n = startI18n(props.translations, lang);
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
      uri: 'http://localhost:8080/v1alpha1/graphql',
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
    const industries = this.INDUSTRIES;
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <NewJobBar i18n={this.i18n} userInfo={this.props.userInfo} />
          <Grid container spacing={24}>
            <Grid item xs={12} md={3}>
              <MenuList i18n={i18n} />
            </Grid>
            <Grid item xs={12} md={6}>
              tipi
            </Grid>
          </Grid>
        </div>
      </I18nextProvider>
    );
  }
}
ShowJob.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(ShowJob));
