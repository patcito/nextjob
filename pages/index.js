/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import AppBarTop from '../components/appbar';
import {withStyles} from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from '@material-ui/core/Grid';
import MenuList from '../components/menu';

import {I18nextProvider} from 'react-i18next';
import startI18n from '../tools/startI18n';
import {getTranslation} from '../tools/translationHelpers';
import IndexJobs from '../components/indexjobs';
import IndexCompanies from '../components/indexcompanies';
import getConfig from 'next/config';
import {getHasuraHost} from '../lib/getHasuraHost';
import Head from '../components/head';
import Router from 'next/router';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const {publicRuntimeConfig} = getConfig();
const grequest = require('graphql-request');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Index extends React.Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);

    this.i18n = startI18n(props.translations, this.props.lang);
  }

  static async getInitialProps({req, query}) {
    //console.log('index', stories);
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
    let userInfo = {};
    let token = null;
    let userId = null;
    let github = false;
    let linkedin = false;
    let currentUser = {};

    const companyId = query.companyId || null;
    if (query.lang === 'fr') {
      lang = 'fr';
    }
    if (req) {
      console.log('query', query, req.userId);
      query.me && req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      github = req.github;
      linkedin = req.linkedin;
      userInfo = {
        userId: req.userId ? req.userId : null,
        token: token,
        github: github,
        githubEmail: req.githubEmail,
        linkedin: linkedin,
        currentUser: req.currentUser,
      };
    } else {
      token = localStorage.getItem('token');
      localStorage.getItem('currentUser')
        ? (userId = localStorage.getItem('currentUser').id)
        : (userId = null);
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      userInfo = {
        token: token,
        userId: currentUser ? currentUser.id : null,
        github: currentUser ? !!currentUser.githubEmail : false,
        linkedin: currentUser ? !!currentUser.linkedinEmail : false,
        githubEmail: currentUser ? !!currentUser.githubEmail : null,
        currentUser: currentUser,
      };
    }
    const translations = await getTranslation(
      lang,
      ['common', 'namespace1', 'employementtypes', 'jobstitles'],
      publicRuntimeConfig.i18nHost + '/static/locales/',
    );
    let skill = null;
    let description = null;
    let description_fr = null;
    let employementType = null;
    let remote = null;
    let country = null;
    let locality = null;
    let meId = null;

    console.log('QUERY', query);
    if (query.skill) {
      skill = query.skill;
    }
    if (query.description) {
      description = '%' + query.description + '%';
      description_fr = '%' + query.description + '%';
    }
    if (query.description_fr) {
    }
    if (query.jobEmployementType && query.jobEmployementType.length > 0) {
      employementType = query.jobEmployementType.split(',');
    }
    if (query.country) {
      country = query.country;
    }
    if (query.locality) {
      locality = query.locality;
    }
    if (query.remote) {
      remote = true;
    }
    let companyModsquery = '';
    let companyAggregatequery = '';

    if (query.mejobs) {
      meId = userInfo.userId;
      companyModsquery = '{Company: {Moderators: {User: {id: {_eq: $meId}}}}}';
    }
    if (userInfo.userId && parseInt(userInfo.userId)) {
      companyAggregatequery = `
    SearchNotification(where: {userId: {_eq: $userId}}){
      id
      userId
      query
      }
	  Company_aggregate(where:
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
    const getJobsopts = {
      uri: getHasuraHost(process, req, publicRuntimeConfig),
      json: true,
      query: `
        query JobCompanies(
          $country: String
          $locality: String
          $userId: Int
          $ownerId: Int
          $meId: Int
          $companyId: Int
          $skill: String
          $description: String
          $description_fr: String
          $remote: Boolean
          $employementType: [String]
          $nocompany: String
        ) {
			${companyAggregatequery}
              Company(
            where: {
              _and: [{id: {_eq: $companyId}}]
            }
          ) {
            id
            updatedAt
            description
            description_fr
            ownerId
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
          }
          group_by_location {
            locality
            country
          }
          Job(order_by: {id: desc},
            where: {
              _and: [
                {
                  _and: [
                    {country: {_eq: $country}}
                    {locality: {_eq: $locality}}
                  ]
                }
                {
                  _or: [
                    {ownerId: {_eq: $meId}}
                    {Company: {ownerId: {_eq: $meId}}}
                    ${companyModsquery}
                  ]
                }
                {Skills: {Skill: {_ilike: $skill}}}
                {
                  _or: [
                    {description: {_like: $description}}
                    {Skills: {Skill: {_ilike: $description}}}
                    {Company: {name: {_ilike: $description}}}
                    {Company: {description: {_ilike: $description}}}
                    {Company: {description_fr: {_ilike: $description_fr}}}
                    {JobFunctions: {JobFunction: {_ilike: $description}}}
                    {JobTitle: {_ilike: $description}}
                  ]
                }
                {remote: {_eq: $remote}}
                {EmployementType: {_in: $employementType}}
                {companyId: {_eq: $companyId}, isPublished: {_eq: true}}
              ]
            }
          ) {
            id
            hasMonthlySalary
            Company {
              name
              description
              description_fr
              yearFounded
              updatedAt
            }
            ownerId
            remote
            JobFunctions {
              JobFunction
            }
            Industries {
              IndustryName
            }
            Skills {
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

            location
            street_number
            route
            locality
            administrative_area_level_1
            country
            postal_code
            description

            EmployementType
            SeniorityLevel
            JobTitle
          }
        }
      `,
      headers: {
        'x-access-token': token,
      },
    };
    /*
          *
          *
          * query{
              *   Job(where: {_and:[{Skills: {Skill: {_like: "%React.js%"}}},
                      *     {description: {_like: "%nope%"}}, {remote: {_eq: true}},
                      *         {JobEmployementType: {type: {_in: ["FullTime", "PartTime",
                          *               "Contract", "Temporary", "Volunteer", "Internship"]}}}]}){
                  *                   description
                      *                     }
              *                     }
                  *               }
              * }*/
    // select distinct(locality), country, location from "Job"
    // select
    //       ST_Distance_Sphere(location::Geometry, ST_MakePoint(48.857091,
    //                   2.353702)) as distance
    //                    from
    //                        "Job"
    //                        create or replace function search_job_distance(lat float,long float)
    //                          returns table (distance float)
    //                          as
    //                          $body$
    //                          select ST_Distance_Sphere(location::Geometry, ST_MakePoint(lat,
    //                                     long)) as distance from  "Job"
    //
    //                                     $body$
    //                                     language sql;
    const client = new grequest.GraphQLClient(getJobsopts.uri, {
      headers: getJobsopts.headers,
    });
    let jobsAndCompanies = await client
      .request(getJobsopts.query, {
        ownerId: userId,
        userId: userInfo.userId,
        meId: meId,
        companyId: companyId,
        skill: skill,
        description: description,
        description_fr: description,
        remote: remote,
        employementType: employementType,
        country: country,
        locality: locality,
        nocompany: query.companies ? null : '_no_company_',
      })
      .catch(err => console.log('catch', err));

    console.log('QUERY', getJobsopts.query);
    console.log('ARGS', {
      ownerId: userId,
      userId: userInfo.userId,
      meId: meId,
      companyId: companyId,
      skill: skill,
      description: description,
      remote: remote,
      employementType: employementType,
      country: country,
      locality: locality,
      nocompany: query.companyId ? companyId : '_no_company_',
    });
    let title = 'ReactEurope Jobs';
    query.skill ? (title += ' - ' + query.skill) : null;
    if (query.companies) {
      title += ' - Companies';
    }
    let techs = 'React, React Native, GraphQL and more';
    query.skill ? (techs = query.skill) : null;
    let metaDescription = 'Find a job working with ' + techs + ' at ';

    query.companyId
      ? (metaDescription += jobsAndCompanies.Company[0].name)
      : (metaDescription += 'top companies');
    let searches = [];
    if (jobsAndCompanies) {
      searches = jobsAndCompanies.SearchNotification;
    }
    if (
      companyId &&
      jobsAndCompanies.Company &&
      jobsAndCompanies.Company.length > 0
    ) {
      title += ` - ${jobsAndCompanies.Company[0].name} listing`;
    }
    let url;
    req
      ? (url = publicRuntimeConfig.host + req.path)
      : (url = publicRuntimeConfig.host + Router.pathname);

    let showNotifications = !(Object.entries(query).length === 0); // && query.constructor === Object
    if (Object.entries(query).length === 1 && query.code) {
      showNotifications = false;
    }
    console.log('SHOW NOTIFICATIONS', showNotifications);
    console.log('SHOW NOTIFICATIONS', query);
    return {
      translations,
      jobsAndCompanies,
      query,
      userInfo,
      lang,
      companyId,
      title,
      metaDescription,
      url,
      showNotifications,
      searches,
    };
  }
  componentDidMount(props) {
    if (this.props.query.action === 'stop-notifications') {
      this.setState({openNotification: true});
    }
  }
  content = () => {
    const query = this.props.query;
    if (this.props.query.companies) {
      return (
        <IndexCompanies
          i18n={this.i18n}
          query={this.props.query}
          companies={this.props.jobsAndCompanies.Company}
        />
      );
    } else if (query.action === 'editCompany') {
      return null;
    } else {
      return (
        <IndexJobs
          i18n={this.i18n}
          query={this.props.query}
          jobs={this.props.jobsAndCompanies.Job}
        />
      );
    }
  };
  render(props) {
    let userInfo;
    console.log('userInfoCheck', this.props.userInfo);
    console.log('userInfoCheck', this.props.query);
    userInfo = this.props.userInfo;
    const i18n = this.i18n;
    return (
      <I18nextProvider i18n={this.i18n}>
        <>
          <AppBarTop
            i18n={this.i18n}
            userInfo={userInfo}
            group_by_location={this.props.jobsAndCompanies.group_by_location}
            companyCount={this.props.jobsAndCompanies.Company_aggregate}
          />
          <div style={{paddingLeft: 12, paddingRight: 12}}>
            <Head
              title={this.props.title}
              description={this.props.metaDescription}
              url={this.props.url}
              ogImage={publicRuntimeConfig.host + '/static/touch-icon.png'}
            />
            <Grid container spacing={24}>
              <Grid item xs={12} md={3}>
                <MenuList
                  i18n={i18n}
                  userInfo={userInfo}
                  me={this.props.query.me || this.props.companyId}
                  companyCount={this.props.jobsAndCompanies.Company_aggregate}
                  showNotifications={this.props.showNotifications}
                  query={this.props.query}
                  searchNotification={this.props.searches}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                {this.content()}
              </Grid>
            </Grid>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
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
                {this.i18n.t(
                  'You will not receive email notifications anymore.',
                )}
              </span>
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
        </>
      </I18nextProvider>
    );
  }
}

export default withStyles(styles)(Index);
