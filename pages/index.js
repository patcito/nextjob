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
const grequest = require('graphql-request');
// get language from query parameter or url path
const lang = 'fr';
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

    this.i18n = startI18n(props.translations, 'fr');
  }

  static async getInitialProps({req, query}) {
    //console.log('index', stories);
    console.log('companyid', query.companyId);
    let userInfo = {};
    let token = null;
    let userId = null;
    const companyId = query.companyId || null;
    if (req) {
      query.me && req.userId ? (userId = req.userId) : (userId = null);
      token = req.token || null;
      userInfo = {userId: userId, token: token};
    } else {
      token = localStorage.getItem('token');
      localStorage.getItem('currentUser')
        ? (userId = localStorage.getItem('currentUser').id)
        : (userId = null);
    }
    const translations = await getTranslation(
      lang,
      ['common', 'namespace1'],
      'http://localhost:4000/static/locales/',
    );
    const getJobsopts = {
      uri: 'http://localhost:8080/v1alpha1/graphql',
      json: true,
      query: `query JobCompanies($ownerId: Int, $companyId: Int){
              Company(where: {ownerId: {_eq: $ownerId}}){
                  id
                  description
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
                  Skills{
                  Skill
                  }
                  Perks{Perk}
              }
			Job(where: {_and: [{companyId: {_eq: $companyId}, isPublished: {_eq: true}}]}){
				    id
					hasMonthlySalary
                    Company{name
                    description
                    yearFounded}
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
	}`,
      headers: {
        'x-access-token': token,
      },
    };
    const client = new grequest.GraphQLClient(getJobsopts.uri, {
      headers: getJobsopts.headers,
    });
    let jobsAndCompanies = await client.request(getJobsopts.query, {
      ownerId: userId,
      companyId: companyId,
    });
    return {translations, jobsAndCompanies, query};
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
        <IndexJobs i18n={this.i18n} jobs={this.props.jobsAndCompanies.Job} />
      );
    }
  };
  render(props) {
    const i18n = this.i18n;
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <AppBarTop i18n={this.i18n} />
          <Grid container spacing={24}>
            <Grid item xs={12} md={3}>
              <MenuList i18n={i18n} />
            </Grid>
            <Grid item xs={12} md={8}>
              {this.content()}
            </Grid>
          </Grid>
        </div>
      </I18nextProvider>
    );
  }
}

export default withStyles(styles)(Index);
