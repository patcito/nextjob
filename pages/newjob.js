/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');
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

const PlacesSelect = dynamic(import('../components/placesselect'), {
  ssr: false,
});
import {withRouter} from 'next/router';
import Slider, {Range} from 'rc-slider';
import Tooltip from 'rc-tooltip';
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();

import 'rc-slider/assets/index.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const TooltipRange = createSliderWithTooltip(Range);

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '90%',
  },
  flex: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  howctionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  inputForm: {
    '@media (min-width: 992px)': {
      width: '45%',
    },
  },
  selectFormControl: {
    margin: theme.spacing.unit,
    '@media (min-width: 992px)': {
      width: '45%',
    },
  },
});

class NewJob extends React.Component {
  state = {
    job: {},
    yearsExperienceRange: [0, 4],
    dailySalaryRange: [100, 1500],
    hasApplicationEmail: true,
    open: false,
    isPublished: true,
    yearlySalaryRange: [40000, 50000],
    monthlySalaryRange: [500, 1000],
    remote: false,
    selectedCompany: '',
    selectedEmployementType: {value: 'FullTime', label: 'Full-time'},
    selectedSeniorityLevel: {value: 'EntryLevel', label: 'Entry level'},
    jobTitle: {value: 'frontend developer', label: 'frontend developer'},
    activeStep: 0,
    addNewCompany: false,
    minSalary: 10,
    maxSalary: 10,
  };
  handleNext = () => {
    switch (this.state.activeStep) {
      case 0:
        if (this.state.addNewCompany) {
          this.createCompany();
        } else {
          this.setState({
            activeStep: 1,
          });
        }
        break;
      case 1:
        this.setState(state => ({
          activeStep: 2,
        }));
        break;
      case 2:
        //alert(JSON.stringify(this.props.job));
        this.saveJob();
        break;

      default:
        console.log('not submitting');
    }
  };

  saveJob = () => {
    const vars = {
      isPublished: this.state.isPublished,
      applicationEmail: this.state.applicationEmail,
      applicationUrl: this.state.applicationUrl,
      remote: this.state.remote,
      companyId: this.state.selectedCompany,
      applyDirectly: !this.state.hasApplicationEmail,
      minimumExperienceYears: this.state.yearsExperienceRange[0],
      maximumExperienceYears: this.state.yearsExperienceRange[1],
      minimumYearlySalary: this.state.yearlySalaryRange[0],
      maximumYearlySalary: this.state.yearlySalaryRange[1],
      minimumMonthlySalary: this.state.monthlySalaryRange[0],
      maximumMonthlySalary: this.state.monthlySalaryRange[1],
      ownerId: this.state.currentUser.id,
      street_number: this.state.fullAddress.street_number,
      route: this.state.fullAddress.route,
      locality: this.state.fullAddress.locality,
      administrative_area_level_1: this.state.fullAddress
        .administrative_area_level_1,
      country: this.state.fullAddress.country,
      postal_code: this.state.fullAddress.postal_code,
      description: this.state.jobDescription,
      description_fr: this.state.jobDescriptionFr,
      EmployementType: this.state.selectedEmployementType.value,
      SeniorityLevel: this.state.selectedSeniorityLevel.value,
      JobTitle: this.state.jobTitle.value,
      hasMonthlySalary: this.state.hasMonthlySalary,
      location: {
        type: 'Point',
        coordinates: [this.state.coordinates.lat, this.state.coordinates.lng],
      },
    };
    if (this.props.job) {
      vars.id = this.props.job.id;
    }

    const updateQuery = `
      mutation update_job(
        $remote: Boolean
        $id: Int
        $companyId: Int
        $applyDirectly: Boolean
        $isPublished: Boolean
        $hasMonthlySalary: Boolean
        $minimumExperienceYears: Int
        $maximumExperienceYears: Int
        $minimumYearlySalary: Int
        $maximumYearlySalary: Int
        $maximumMonthlySalary: Int
        $minimumMonthlySalary: Int
        $applicationEmail: String
        $applicationUrl: String
        $ownerId: Int
        $location: geography
        $street_number: String
        $route: String
        $locality: String
        $administrative_area_level_1: String
        $country: String
        $postal_code: String
        $description: String
        $description_fr: String
        $EmployementType: String
        $SeniorityLevel: String
        $JobTitle: String
      ) {
        update_Job(
          where: {id: {_eq: $id}}
          _set: {
            remote: $remote
            companyId: $companyId
            isPublished: $isPublished
            applyDirectly: $applyDirectly
            hasMonthlySalary: $hasMonthlySalary
            minimumExperienceYears: $minimumExperienceYears
            maximumExperienceYears: $maximumExperienceYears
            ownerId: $ownerId
            minimumYearlySalary: $minimumYearlySalary
            maximumYearlySalary: $maximumYearlySalary
            maximumMonthlySalary: $maximumMonthlySalary
            minimumMonthlySalary: $minimumMonthlySalary
            applicationEmail: $applicationEmail
            applicationUrl: $applicationUrl
            location: $location
            street_number: $street_number
            route: $route
            locality: $locality
            administrative_area_level_1: $administrative_area_level_1
            country: $country
            postal_code: $postal_code
            description: $description
            description_fr: $description_fr
            EmployementType: $EmployementType
            SeniorityLevel: $SeniorityLevel
            JobTitle: $JobTitle
          }
        ) {
          returning {
            id
            description
            description_fr
          }
        }
      }
    `;
    const insertQuery = `mutation insert_job( $remote: Boolean,
 $companyId: Int,
 $applyDirectly: Boolean,
 $isPublished: Boolean,
$hasMonthlySalary: Boolean,
 $minimumExperienceYears: Int,
 $maximumExperienceYears: Int,
      $minimumYearlySalary: Int,
     $maximumYearlySalary: Int,
      $maximumMonthlySalary: Int,
      $minimumMonthlySalary: Int,
$applicationEmail: String,
$applicationUrl: String,

 $ownerId: Int,
 $location: geography,
 $street_number: String,
 $route: String,
 $locality: String,
 $administrative_area_level_1: String,
 $country: String,
 $postal_code: String,
 $description: String,
 $description_fr: String,
 $EmployementType: String,
 $SeniorityLevel: String,
		$JobTitle: String){
			insert_Job(objects:[
			{
				remote: $remote,
				companyId: $companyId,
				isPublished: $isPublished,
				hasMonthlySalary: $hasMonthlySalary,
				applyDirectly: $applyDirectly,
				minimumExperienceYears: $minimumExperienceYears,
				maximumExperienceYears: $maximumExperienceYears,
      minimumYearlySalary: $minimumYearlySalary,
      maximumYearlySalary: $maximumYearlySalary,
      maximumMonthlySalary: $maximumMonthlySalary,
      minimumMonthlySalary: $minimumMonthlySalary,
	  applicationEmail: $applicationEmail,
	  applicationUrl: $applicationUrl,

				ownerId: $ownerId,

				    location: $location,
				street_number: $street_number,
				route: $route,
				locality: $locality,
				administrative_area_level_1: $administrative_area_level_1,
				country: $country,
				postal_code: $postal_code,
				description: $description,
				description_fr: $description_fr,
				EmployementType: $EmployementType,
				SeniorityLevel: $SeniorityLevel,
				JobTitle: $JobTitle,

			}

			]){
				returning{
					      id

				}

			}

		}
		`;

    const saveJobopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: this.props.job ? updateQuery : insertQuery,
      headers: {
        'x-access-token': this.state.token,
      },
    };
    const that = this;
    const client = new grequest.GraphQLClient(saveJobopts.uri, {
      headers: saveJobopts.headers,
    });
    client.request(saveJobopts.query, vars).then(gdata => {
      const currentUser = that.state.currentUser;
      //currentUser.jobs.push(gdata.insert_Job.returning[0]);
      const jobId = that.props.job
        ? that.props.job.id
        : gdata.insert_Job.returning[0].id;
      let jobFunctions = [];
      let industries = [];
      let skills = [];
      that.state.jobFunction.map(jf => {
        jobFunctions.push({
          JobFunction: jf.value.JobFunction || jf.value,
          JobId: jobId,
        });
      });
      that.state.companyIndustries.map(ci => {
        industries.push({
          IndustryName: ci.value.IndustryName || ci.value,
          JobId: jobId,
        });
      });
      this.state.skills
        ? that.state.skills.map(skill => {
            skills.push({
              Skill: skill.value.Skill || skill.value,
              JobId: jobId,
            });
          })
        : null;
      let extraVars = {
        skills: skills,
        industries: industries,
        jobFunctions: jobFunctions,
        id: that.props.job ? that.props.job.id : 0,
      };
      if (!skills || skills === [] || skills === null || skills.length === 0) {
        extraVars.skills = [{Skill: 'React.js', JobId: jobId}];
      }
      const saveJobExtrasopts = {
        uri: getHasuraHost(process, undefined, publicRuntimeConfig),
        json: true,
        query: `
		mutation insert_extras($id: Int, $skills: [SkillJob_insert_input!]!,
		$industries: [JobIndustry_insert_input!]!,
		  $jobFunctions: [JobFunctionJob_insert_input!]!
		){
  delete_JobFunctionJob(where: {JobId: {_eq: $id}}){
    affected_rows

}
	delete_JobIndustry(where: {JobId: {_eq: $id}}){
    affected_rows

}
  delete_SkillJob(where: {JobId: {_eq: $id}}){
    affected_rows

}
		insert_SkillJob(objects: $skills){
			    returning{Skill}

		}
		insert_JobIndustry(objects: $industries){
			    returning{IndustryName}

		}
		insert_JobFunctionJob(objects: $jobFunctions){
			    returning{JobFunction}
		}
	}
	`,
        headers: {
          'x-access-token': this.state.token,
        },
      };

      client.request(saveJobExtrasopts.query, extraVars).then(gdata => {
        history.pushState({}, 'page 2', '/jobs/update/' + jobId);
      });

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      that.setState({
        addedJob: true,
        activeStep: 3,
      });
    });
  };

  handleBack = init => {
    switch (this.state.activeStep) {
      case 0:
        if ((this.state.activeStep === 0 && this.state.addNewCompany) || init) {
          this.setState(state => ({
            addNewCompany: false,
            activeStep: 0,
          }));
        } else {
          this.setState(state => ({
            activeStep: 0,
          }));
        }
        break;
      case 1:
        this.setState(state => ({
          activeStep: 0,
        }));
        break;
      case 2:
        this.setState(state => ({
          activeStep: 1,
        }));
        break;
    }
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };
  handleChangeApplicationUrl = event => {
    this.setState({
      [event.target.name]: event.target.value,
      hasApplicationEmail: false,
      applicationEmail: null,
    });
  };
  handleSliderChange = value => {
    this.setState({yearsExperienceRange: value});
  };

  handleYearlySalaryRangeSliderChange = value => {
    this.setState({yearlySalaryRange: value});
  };

  handleMonthlySalaryRangeSliderChange = value => {
    this.setState({monthlySalaryRange: value});
  };

  handleCheckboxChange = event => {
    this.setState({[event.target.name]: !this.state[event.target.name]});
    //this.setState({remote: !this.state.remote});
  };

  handleRadioChange = event => {
    this.setState({
      value: event.target.value,
      hasApplicationEmail: !this.state.hasApplicationEmail,
    });
  };

  handleSelectCompany = event => {
    this.setState({[event.target.name]: event.target.value});
    if (event.target.value === '_add_') {
      this.setState({addNewCompany: true});
    }
  };

  handleSelectEmployementTypes = event => {
    this.setState({
      [event.target.name]: {
        value: event.target.value,
        label: this.i18n.t('employementtypes:' + event.target.value),
      },
    });
  };

  handleSelectSeniorityLevels = event => {
    this.setState({
      [event.target.name]: {
        value: event.target.value,
        label: this.i18n.t('senioritylevels:' + event.target.value),
      },
    });
  };

  handleChangeIndustry = value => {
    if (value) {
      this.setState({industry: value, industryvalid: true});
    } else {
      this.setState({industry: value, industryvalid: false});
    }
  };

  handleChangeJobTitle = value => {
    if (value) {
      this.setState({jobTitle: value, jobTitlevalid: true});
    } else {
      this.setState({jobTitle: this.state.jobTitle, jobTitlevalid: false});
    }
  };

  handleChangeJobFunction = value => {
    if (value) {
      this.setState({jobFunction: value, jobFunctionvalid: true});
    } else {
      this.setState({
        jobFunction: this.state.jobFunction,
        jobFunctionvalid: false,
      });
    }
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

  handleChangeCompanyIndustries = value => {
    if (value) {
      this.setState({companyIndustries: value, companyIndustriesvalid: true});
    } else {
      this.setState({
        companyIndustries: this.state.companyIndustries,
        companyIndustriesvalid: false,
      });
    }
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
    if (forceFr === 1) {
      lang = 'fr';
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
      query.me || req.userId ? (userId = req.userId) : (userId = null);
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
        ? (userId = localStorage.getItem('currentUser').id)
        : (userId = null);
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }

    const createCompanyopts = {
      uri: getHasuraHost(process, req, publicRuntimeConfig),
      json: true,
      query: `query Job($id: Int){
			Job(where: {id: {_eq: $id}}){
				    id
					hasMonthlySalary
				    ownerId
				    remote
					JobFunctions{
    		  			JobFunction
					}
				Industries{
				  IndustryName

			}
				Skills{
				  Skill

			}
		  isPublished
		  companyId
		  applyDirectly
		  minimumExperienceYears
		  maximumExperienceYears
      minimumYearlySalary
      maximumYearlySalary
      maximumMonthlySalary
      minimumMonthlySalary

		applicationEmail
		applicationUrl
		location
        street_number
        route
        locality
        administrative_area_level_1
        country
        postal_code
      description
      description_fr

      EmployementType
      SeniorityLevel
      JobTitle

			}
	}`,
      headers: {
        'x-access-token': token,
        'x-access-role': 'userType',
      },
    };
    const client = new grequest.GraphQLClient(createCompanyopts.uri, {
      headers: createCompanyopts.headers,
    });
    if (query.id) {
      let job = await client.request(createCompanyopts.query, {
        id: query.id || 0,
      });
      if (job.Job.length > 0) {
        job = job.Job[0];
      } else {
        job = null;
      }
      return {translations, job, userInfo, lang, forceFr};
    } else {
      const job = null;
      return {translations, job, userInfo, lang, forceFr};
    }
  }
  constructor(props) {
    super(props);
    const {router, job} = this.props;
    this.i18n = startI18n(props.translations, this.props.lang);

    this.classes = this.props;
    this.INDUSTRIES = INDUSTRIES.map(suggestion => ({
      value: suggestion.industry,
      label: this.i18n.t('industries:' + suggestion.industry),
    }));
    this.JOBSTITLES = JOBSTITLES.map(suggestion => ({
      value: suggestion.title,
      label: this.i18n.t('jobstitles:' + suggestion.title),
    }));
    this.JOBFUNCTIONS = JOBFUNCTIONS.map(suggestion => ({
      value: suggestion.title,
      label: this.i18n.t('jobfunctions:' + suggestion.title),
    }));
    this.EMPLOYEMENTTYPES = EMPLOYEMENTTYPES.map(suggestion => ({
      value: suggestion.type,
      label: this.i18n.t('employementtypes:' + suggestion.type),
    }));
    this.SENIORITYLEVELS = SENIORITYLEVELS.map(suggestion => ({
      value: suggestion.level,
      label: this.i18n.t('senioritylevels:' + suggestion.level),
    }));
    this.SKILLS = SKILLS.map(suggestion => ({
      value: suggestion.name,
      label: suggestion.name,
    }));
    //return a.industry - b.industry;
    //});
  }

  componentDidMount(props) {
    /*location: {
        type: 'Point',
        coordinates: [this.state.coordinates.lat, this.state.coordinates.lng],
      },
    };*/ if (
      this.props.job
    ) {
      this.setState({
        jobFunction: [
          {
            value: 'Engineering',
            label: this.i18n.t('jobfunctions:Engineering'),
          },
        ],
        selectedEmployementType: {
          value: 'FullTime',
          label: this.i18n.t('employementtypes:Full-time'),
        },
      });
    }

    if (typeof window !== 'undefined' && window && window.localStorage) {
      const job = this.props.job;
      if (job) {
        const jobState = {
          isPublished: job.isPublished,
          remote: job.remote,
          applicationEmail: job.applicationEmail,
          applicationUrl: job.applicationUrl,
          applyDirectly: job.applyDirectly,

          selectedCompany: job.companyId,
          hasApplicationEmail: !job.applyDirectly,
          yearsExperienceRange: [
            job.minimumExperienceYears,
            job.maximumExperienceYears,
          ],
          yearlySalaryRange: [job.minimumYearlySalary, job.maximumYearlySalary],
          monthlySalaryRange: [
            job.minimumMonthlySalary,
            job.maximumMonthlySalary,
          ],
          location: job.location,
          coordinates: {
            lat: job.location.coordinates[0],
            lng: job.location.coordinates[1],
          },
          fullAddress: {
            street_number: job.street_number,
            route: job.route,
            locality: job.locality,
            state: job.administrative_area_level_1,
            country: job.country,
            postal_code: job.postal_code,
          },
          hasMonthlySalary: job.hasMonthlySalary,
          currentAddressDescription:
            job.street_number || job.route || job.locality
              ? job.street_number +
                ' ' +
                job.route +
                ' ' +
                job.locality +
                ', ' +
                job.country
              : job.country,
          jobDescription: job.description,
          jobDescriptionFr: job.description_fr,
          jobFunction: job.JobFunctions.map(v => ({
            value: v,
            label: this.i18n.t('jobfunctions:' + v.JobFunction),
          })),
          skills: job.Skills.map(v => ({
            value: v,
            label: v.Skill,
          })),
          companyIndustries: job.Industries.map(v => ({
            value: v,
            label: this.i18n.t('industries:' + v.IndustryName),
          })),
          selectedEmployementType: {
            value: job.EmployementType,
            label: this.i18n.t('employementtypes:' + job.EmployementType),
          },
          selectedSeniorityLevel: {
            value: job.SeniorityLevel,
            label: this.i18n.t('senioritylevels:' + job.SeniorityLevel),
          },
          jobTitle: {
            label: this.i18n.t('jobstitles:' + job.JobTitle),
            value: job.JobTitle,
          },
        };
        this.setState(jobState);
      } else {
        this.setState({
          jobFunction: [
            {
              value: 'Engineering',
              label: this.i18n.t('jobfunctions:Engineering'),
            },
          ],
          selectedEmployementType: {
            value: 'FullTime',
            label: this.i18n.t('employementtypes:Full-time'),
          },
        });
      }
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('currentUser');
      if (token && typeof user !== 'undefined') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser.jobs) {
          currentUser.jobs = [];
        }
        const companies = currentUser.Companies;
        if (companies && companies.length > 0) {
          if (!job || (job.Industries && job.Industries.length === 0)) {
            this.setState({
              companyIndustries: [
                {
                  value: companies[0].Industry,
                  label: this.i18n.t('industries:' + companies[0].Industry),
                },
              ],
            });
          }
          this.setState({
            currentUser: currentUser,
            token: localStorage.getItem('token'),
            selectedCompany: this.props.job
              ? this.props.job.companyId
              : companies[0].id,
            addNewCompany: false,
            applicationEmail:
              this.props.job && this.props.job.applicationEmail
                ? this.props.job.applicationEmail
                : currentUser.linkedinEmail,
          });
        } else {
          this.setState({
            currentUser: JSON.parse(localStorage.getItem('currentUser')),
            token: localStorage.getItem('token'),
            addNewCompany: true,
            applicationEmail:
              this.props.job && this.props.job.applicationEmail
                ? this.props.job.applicationEmail
                : currentUser.linkedinEmail,
            companyIndustries: [
              {
                value: 'Computer_Software',
                label: this.i18n.t('industries:Computer_Software'),
              },
              {
                value: 'Information_Technology_and_Services',
                label: this.i18n.t(
                  'industries:Information_Technology_and_Services',
                ),
              },
            ],
          });
        }
      }
    }
  }
  getSteps = () => {
    return [
      this.i18n.t('Set Company, position and location'),
      this.i18n.t('Add more job details'),
      this.i18n.t('Target your audience'),
    ];
  };

  createCompany = () => {
    const newCompany = {
      name: this.state.name,
      Industry: this.state.industry.value,
      yearFounded: this.state.yearFounded,
      description: this.state.description,
      url: this.state.url,
      ownerId: this.state.currentUser.id,
    };
    const that = this;
    const createCompanyopts = {
      uri: getHasuraHost(process, undefined, publicRuntimeConfig),
      json: true,
      query: `mutation insert_Company($ownerId: Int!,
    			$name: String!,
			    $url: String!,
			    $description: String!,
			    $yearFounded: Int!,
				$Industry: String!) {
				  insert_Company(objects: [{
					ownerId: $ownerId,
					name: $name,
					url: $url,
					description: $description,
					yearFounded: $yearFounded,
					Industry: $Industry

				}]){
					returning{
					  id
					  name
			}
			}
			}
				`,
      headers: {
        'x-access-token': this.state.token,
      },
    };
    const client = new grequest.GraphQLClient(createCompanyopts.uri, {
      headers: createCompanyopts.headers,
    });
    client.request(createCompanyopts.query, newCompany).then(gdata => {
      const currentUser = that.state.currentUser;
      const companies = currentUser.Companies || [];
      companies.push(gdata.insert_Company.returning[0]);
      currentUser.Companies = companies; //.push(gdata.insert_Company.returning[0]);

      this.upload(gdata.insert_Company.returning[0].id);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      that.setState({
        currentUser: currentUser,
        selectedCompany: gdata.insert_Company.returning[0].id,
        addNewCompany: false,
      });
      this.handleBack(true);
    });
  };

  upload = companyId => {
    console.log(this.state.file);
    if (this.state.file && this.state.file.length > 0) {
      const formData = new FormData();
      formData.append('file', this.state.file[0]);
      console.log(formData);
      fetch('/upload', {
        // Your POST endpoint
        method: 'POST',
        headers: {companyId: companyId},
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

  checkActiveStepValidity = activeStep => {
    switch (activeStep) {
      case 0:
        if (this.state.addNewCompany) {
          return !(
            this.state.name &&
            this.state.description &&
            this.state.url &&
            this.state.yearFounded &&
            this.state.yearFounded > 1900 &&
            this.state.industry
          );
        } else {
          return (
            !this.state.selectedCompany ||
            !this.state.jobTitle ||
            !this.state.fullAddress
          );
        }
        break;
      case 1:
        return !(
          this.state.jobFunction &&
          this.state.jobFunction.length > 0 &&
          this.state.jobFunction.length <= 3 &&
          this.state.selectedEmployementType &&
          this.state.selectedSeniorityLevel &&
          this.state.companyIndustries &&
          this.state.companyIndustries.length > 0 &&
          this.state.companyIndustries.length <= 3 &&
          this.state.jobDescription &&
          this.state.jobDescription.length > 2
        );
        break;
    }
  };

  handleBlur = (event, required) => {
    this.setState({
      [event.target.name + 'valid']:
        event.target.value || !required ? true : false,
    });
  };

  handleBlurIndustry = (value, required) => {
    this.setState({
      industryvalid: value || !required ? true : false,
    });
  };

  handleBlurJobTitle = (value, required) => {
    this.setState({
      jobTitlevalid: value || !required ? true : false,
    });
  };

  handleBlurJobFunction = (value, required) => {
    this.setState({
      jobFunctionvalid: value || !required ? true : false,
    });
  };

  handleBlurSkills = (value, required) => {
    this.setState({
      skillsvalid: value || !required ? true : false,
    });
  };

  handleBlurCompanyIndustries = (value, required) => {
    this.setState({
      companyIndustriesvalid: value || !required ? true : false,
    });
  };

  handleFocus = (event, required) => {
    this.setState({
      [event.target.name + 'valid']: true,
    });
  };

  getStepContent = (
    step,
    classes,
    industries,
    jobstitles,
    jobfunctions,
    employementtypes,
    senioritylevels,
    skills,
  ) => {
    switch (step) {
      case 0:
        return (
          <>
            {this.state.currentUser &&
            this.state.currentUser.Companies &&
            this.state.currentUser.Companies.length > 0 &&
            !this.state.addNewCompany ? (
              <>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="selectedCompany-helper">
                    {this.i18n.t('newjob:Company')}
                  </InputLabel>
                  <Select
                    value={this.state.selectedCompany}
                    onChange={this.handleSelectCompany}
                    input={
                      <Input name="selectedCompany" id="selectCompany-helper" />
                    }>
                    {this.state.currentUser.Companies.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="_add_">
                      {this.i18n.t('Add a new company')}
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    {this.i18n.t('newjob:Select your company')}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} className={classes.formControl}>
                  <DownshiftSelect
                    i18n={this.i18n}
                    suggestions={jobstitles}
                    selectedItem={this.state.jobTitle}
                    label={this.i18n.t('jobstitles:frontend developer')}
                    onBlur={e => this.handleBlur(e, true)}
                    onFocus={e => this.handleFocus(e, true)}
                    handleParentChange={this.handleChangeJobTitle}
                    handleParentBlur={this.handleBlurJobTitle}
                    name="jobTitle"
                    id="jobTitle"
                    required={true}
                  />
                  <FormHelperText>
                    {this.i18n.t("newjob:Select your job's title")}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth={true}>
                  {this.state.googleMaps || typeof google !== 'undefined' ? (
                    <PlacesSelect
                      i18n={this.i18n}
                      placeholder={
                        this.state.currentAddressDescription ||
                        this.i18n.t('newjob:Where the job will take place')
                      }
                      that={this}
                    />
                  ) : null}
                </FormControl>
                <FormControl fullWidth={true} className={classes.formControl}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.remote}
                        name="remote"
                        value="remote"
                        onChange={this.handleCheckboxChange}
                        color="primary"
                      />
                    }
                    label={this.i18n.t('Remote')}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <FormLabel component="legend">
                    {this.i18n.t('newjob:Choose how you want people to apply')}
                  </FormLabel>
                  <RadioGroup
                    aria-label="Has application email"
                    name="hasApplicationEmail"
                    className={classes.group}
                    value={this.state.value}>
                    <FormControlLabel
                      value="hasApplicationEmail"
                      control={
                        <Radio
                          checked={this.state.hasApplicationEmail}
                          onChange={this.handleRadioChange}
                        />
                      }
                      label={this.i18n.t(
                        'newjob:From this site directly (recommended)',
                      )}
                    />
                    <FormControl
                      style={{marginTop: '-15px'}}
                      error={this.state.namevalid === false}>
                      <Input
                        id="name-simple"
                        className={classes.inputForm}
                        name="applicationEmail"
                        value={this.state.applicationEmail}
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
                        {this.i18n.t(
                          'newjob:The email applications will be sent to',
                        )}
                      </FormHelperText>
                    </FormControl>
                    <FormControlLabel
                      value="male"
                      control={
                        <Radio
                          checked={!this.state.hasApplicationEmail}
                          onChange={this.handleRadioChange}
                        />
                      }
                      label={this.i18n.t(
                        'newjob:Direct applicants to an external site to apply',
                      )}
                    />
                    <FormControl
                      style={{marginTop: '-15px'}}
                      error={this.state.namevalid === false}>
                      <Input
                        id="name-simple"
                        className={classes.inputForm}
                        name="applicationUrl"
                        value={this.state.applicationUrl}
                        disabled={this.state.hasApplicationEmail}
                        onChange={this.handleChangeApplicationUrl}
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
                        {this.i18n.t(
                          'newjob:The url applicants will be redirected to',
                        )}
                      </FormHelperText>
                    </FormControl>
                  </RadioGroup>
                </FormControl>
              </>
            ) : (
              <form>
                <FormControl
                  className={classes.formControl}
                  error={this.state.namevalid === false}>
                  <InputLabel htmlFor="name-simple">
                    {this.i18n.t('Name')}
                  </InputLabel>
                  <Input
                    id="name-simple"
                    name="name"
                    value={this.state.name}
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
                      ? this.i18n.t("Your company's name")
                      : this.i18n.t("Your company's name is required")}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  className={classes.formControl}
                  error={this.state.urlvalid === false}
                  aria-describedby="url-text">
                  <InputLabel htmlFor="url">{this.i18n.t('URL')}</InputLabel>
                  <Input
                    id="url"
                    value={this.state.url}
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
                      ? this.i18n.t("Your company's website")
                      : this.i18n.t("Your company's website is required")}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  className={classes.formControl}
                  error={this.state.yearFoundedvalid === false}>
                  <InputLabel htmlFor="yearFounded">
                    {this.i18n.t('Year founded')}
                  </InputLabel>
                  <Input
                    id="yearFounded"
                    name="yearFounded"
                    value={this.state.yearFounded}
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
                      ? this.i18n.t('The year your company was founded')
                      : this.i18n.t(
                          'The year your company was founded is required',
                        )}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  className={classes.formControl}
                  error={this.state.industryvalid === false}>
                  <DownshiftSelect
                    i18n={this.i18n}
                    suggestions={industries}
                    label={this.i18n.t('Industry')}
                    onBlur={e => this.handleBlur(e, true)}
                    onFocus={e => this.handleFocus(e, true)}
                    handleParentChange={this.handleChangeIndustry}
                    handleParentBlur={this.handleBlurIndustry}
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
                      ? this.i18n.t("Select your company's industry")
                      : this.i18n.t(
                          "Selecting your company's industry is required",
                        )}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  fullWidth={true}
                  className={classes.formControl}
                  error={this.state.descriptionvalid === false}>
                  <InputLabel htmlFor="name-simple">
                    {this.i18n.t('Your Mission')}
                  </InputLabel>
                  <Input
                    id="description"
                    value={this.state.description}
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
                      ? this.i18n.t(
                          'Write a description about what your company is about',
                        )
                      : this.i18n.t(
                          'Writing a description about what your company is about is required',
                        )}
                  </FormHelperText>
                  {this.props.lang === 'fr' || this.props.forceFr === 1 ? (
                    <>
                      <Input
                        id="description_fr"
                        value={this.state.description_fr}
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
                  <InputLabel htmlFor="name-simple">
                    {this.i18n.t('Logo')}
                  </InputLabel>
                  <Input
                    id="name-simple"
                    name="file"
                    type="file"
                    onChange={e => {
                      console.log(e.target.files);
                      this.setState({file: e.target.files});
                    }}
                  />
                  <FormHelperText
                    id={
                      this.state.namevalid !== false
                        ? 'name-helper-text'
                        : 'name-error-text'
                    }>
                    {this.state.namevalid !== false
                      ? this.i18n.t("Your company's logo")
                      : this.i18n.t("Your company's logo is required")}
                  </FormHelperText>
                </FormControl>
              </form>
            )}
          </>
        );
      case 1:
        return (
          <>
            <FormControl fullWidth={true} className={classes.formControl}>
              <MultipleDownshiftSelect
                i18n={this.i18n}
                suggestions={jobfunctions}
                selectedItems={this.state.jobFunction || []}
                label={this.i18n.t('newjob:Job function')}
                placeholder={this.i18n.t(
                  'newjob:Select multiple functions (up to 3)',
                )}
                onBlur={e => this.handleBlur(e, true)}
                onFocus={e => this.handleFocus(e, true)}
                handleParentChange={this.handleChangeJobFunction}
                handleParentBlur={this.handleBlurJobFunction}
                name="jobFunction"
                id="jobFunction"
                maxSelection={3}
                required={true}
              />
              <FormHelperText>
                {this.i18n.t("newjob:Select your job's function")}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.selectFormControl}>
              <InputLabel htmlFor="selectedEmployementTypes-helper">
                {this.i18n.t('newjob:Employement types')}
              </InputLabel>
              <Select
                fullWidth={true}
                value={this.state.selectedEmployementType.value}
                onChange={this.handleSelectEmployementTypes}
                input={
                  <Input
                    name="selectedEmployementType"
                    id="selectedEmployementTypes-helper"
                  />
                }>
                {employementtypes.map(c => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {this.i18n.t('newjob:Select your employement type')}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.selectFormControl}>
              <InputLabel htmlFor="selectedSeniorityLevels-helper">
                {this.i18n.t('newjob:Seniority level')}
              </InputLabel>
              <Select
                fullWidth={true}
                value={this.state.selectedSeniorityLevel.value}
                onChange={this.handleSelectSeniorityLevels}
                input={
                  <Input
                    name="selectedSeniorityLevel"
                    id="selectedSeniorityLevels-helper"
                  />
                }>
                {senioritylevels.map(c => (
                  <MenuItem key={c.value} value={c.value}>
                    {this.i18n.t(c.label)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {this.i18n.t('newjob:Select your seniority level')}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} className={classes.formControl}>
              <MultipleDownshiftSelect
                i18n={this.i18n}
                maxSelection={3}
                suggestions={industries}
                selectedItems={this.state.companyIndustries || []}
                label={this.i18n.t('newjob:Company industry')}
                placeholder={this.i18n.t(
                  'newjob:Select multiple company industries (up to 3)',
                )}
                onBlur={e => this.handleBlur(e, true)}
                onFocus={e => this.handleFocus(e, true)}
                handleParentChange={this.handleChangeCompanyIndustries}
                handleParentBlur={this.handleBlurCompanyIndustries}
                name="companyIndustries"
                id="companyIndustries"
                required={true}
              />
              <FormHelperText>
                {this.i18n.t(
                  "newjob:Select your job's company industries this job is related to",
                )}
              </FormHelperText>
            </FormControl>
            <FormControl
              fullWidth={true}
              className={classes.formControl}
              error={this.state.jobdescriptionvalid === false}>
              <InputLabel htmlFor="jobDescription">
                {this.i18n.t('newjob:Job description')}
              </InputLabel>
              <Input
                id="jobDescription"
                value={this.state.jobDescription}
                onChange={this.handleChange}
                name="jobDescription"
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
                    ? 'jobDescription-helper-text'
                    : 'jobDescription-error-text'
                }>
                {this.state.jobDescriptionvalid !== false
                  ? this.i18n.t(
                      'Write a description about what this job is about',
                    )
                  : this.i18n.t(
                      'Writing a description about what this job is about is required',
                    )}
              </FormHelperText>
              {this.props.lang === 'fr' || this.props.forceFr === 1 ? (
                <>
                  <Input
                    id="jobDescriptionFr"
                    value={this.state.jobDescriptionFr}
                    onChange={this.handleChange}
                    name="jobDescriptionFr"
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
                        ? 'jobDescriptionFr-helper-text'
                        : 'jobDescriptionFR-error-text'
                    }>
                    {this.state.jobDescriptionFrvalid !== false
                      ? this.i18n.t(
                          'Write a description about what this job is about in French',
                        )
                      : this.i18n.t(
                          'Writing a description about what this job is about is required',
                        )}
                  </FormHelperText>
                </>
              ) : null}
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <FormControl fullWidth={true} className={classes.formControl}>
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
                  'newjob:Select skills required for the job, at least one skill is required, defaults to React',
                )}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl} style={{width: '95%'}}>
              <Typography variant="subheading" gutterBottom>
                {this.i18n.t('newjob:Years of experience required')}
              </Typography>
              <Slider.Range
                min={0}
                max={20}
                marks={{
                  0: 0,
                  2: 2,
                  4: 4,
                  6: 6,
                  8: 8,
                  10: 10,
                  12: 12,
                  14: 14,
                  16: 16,
                  18: 18,
                  20: 20,
                }}
                step={20}
                onChange={this.handleSliderChange}
                name="yearsExperienceRange"
                defaultValue={this.state.yearsExperienceRange}
              />
            </FormControl>
            <FormControl className={classes.formControl} style={{width: '95%'}}>
              <Typography variant="subheading" gutterBottom>
                {this.i18n.t('newjob:Salary range')}{' '}
                <a
                  onClick={() => {
                    this.setState({
                      hasMonthlySalary: !this.state.hasMonthlySalary,
                    });
                  }}>
                  <Button color="primary" className={classes.button}>
                    {this.state.hasMonthlySalary
                      ? this.i18n.t(
                          'newjob:Switch to a yearly salary range instead',
                        )
                      : this.i18n.t(
                          'newjob:Switch to a monthly salary range instead',
                        )}
                  </Button>
                </a>
              </Typography>
              <TooltipRange
                min={30000}
                max={230000}
                step={10000}
                marks={{
                  30000: '€30k',
                  60000: '€60k',
                  90000: '€90k',
                  140000: '€120k',
                  140000: '€150k',
                  200000: '€180k',
                  230000: '€230k',
                }}
                style={{
                  display: this.state.hasMonthlySalary ? 'none' : 'inherit',
                }}
                tipFormatter={value => `€${value}`} //`
                onChange={this.handleYearlySalaryRangeSliderChange}
                name="salaryRange"
                value={this.state.yearlySalaryRange}
              />
              <TooltipRange
                min={100}
                max={2500}
                step={100}
                marks={{
                  100: '€100',
                  300: '€300',
                  500: '€500',
                  700: '€700',
                  1000: '€1000',
                  1200: '€1200',
                  1500: '€1500',
                  2000: '€2000',
                  2500: '€2500',
                }}
                style={{
                  display: !this.state.hasMonthlySalary ? 'none' : 'inherit',
                }}
                tipFormatter={value => `€${value}`} //`
                onChange={this.handleMonthlySalaryRangeSliderChange}
                name="salaryRange"
                value={this.state.monthlySalaryRange}
              />
            </FormControl>
            <FormControl fullWidth={true} className={classes.formControl}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isPublished}
                    name="isPublished"
                    value="isPublished"
                    onChange={this.handleCheckboxChange}
                    color="primary"
                  />
                }
                label={this.i18n.t(
                  'newjob:Publish (if left uncheck, your ad will not be published)',
                )}
              />
            </FormControl>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  render(props) {
    const {classes} = this.props;
    const steps = this.getSteps();
    const {activeStep} = this.state;
    const industries = this.INDUSTRIES;
    const jobstitles = this.JOBSTITLES;
    const jobfunctions = this.JOBFUNCTIONS;
    const employementtypes = this.EMPLOYEMENTTYPES;
    const senioritylevels = this.SENIORITYLEVELS;
    const skills = this.SKILLS;
    let title = this.props.job
      ? this.i18n.t('ReactEurope Jobs - Edit Job')
      : this.i18n.t('ReactEurope Jobs - New Job');
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
          <NewJobBar i18n={this.i18n} userInfo={this.props.userInfo} />
          <div style={{paddingLeft: 12, paddingRight: 12}}>
            <Grid container spacing={24} alignItems="center" justify="center">
              <Grid item xs={12} md={6}>
                <div>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => {
                      return (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                          <StepContent>
                            {this.getStepContent(
                              index,
                              classes,
                              industries,
                              jobstitles,
                              jobfunctions,
                              employementtypes,
                              senioritylevels,
                              skills,
                            )}
                            <div className={classes.actionsContainer}>
                              <div>
                                <Button
                                  disabled={
                                    activeStep === 0 &&
                                    !this.state.addNewCompany
                                  }
                                  onClick={this.handleBack}
                                  className={classes.button}>
                                  {this.i18n.t('Back')}
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleNext}
                                  disabled={this.checkActiveStepValidity(
                                    activeStep,
                                  )}
                                  className={classes.button}>
                                  {activeStep === steps.length - 1
                                    ? this.i18n.t('Save')
                                    : this.i18n.t('Next')}
                                </Button>
                              </div>
                            </div>
                          </StepContent>
                        </Step>
                      );
                    })}
                  </Stepper>
                  {activeStep === steps.length && (
                    <Paper
                      square
                      elevation={0}
                      className={classes.resetContainer}>
                      <Typography>
                        {this.i18n.t(
                          'newjob:All steps completed - your job has been saved!',
                        )}
                      </Typography>
                      <Button
                        onClick={this.handleReset}
                        className={classes.button}>
                        {this.i18n.t('newjob:Update your job post')}
                      </Button>
                    </Paper>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </I18nextProvider>
    );
  }
}
NewJob.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(withRouter(NewJob));
