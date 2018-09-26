/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
const grequest = require('graphql-request');

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Link from 'next/link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import PlaceIcon from '@material-ui/icons/Place';
import PeopleIcon from '@material-ui/icons/People';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import WorkIcon from '@material-ui/icons/Work';

import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import DownshiftSelect from '../components/downshift';
import INDUSTRIES from '../data/industries';
import Cookies from 'js-cookie';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

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
});

// get language from query parameter or url path
const lang = 'fr';

class EditCompany extends React.Component {
  state = {
    open: false,
    industry: {},
    company: {
      yearFounded: 2006,
      url: '',
      name: '',
      id: 0,
      description: '',
    },
  };
  handleBlurIndustry = (value, required) => {
    this.setState({
      industryvalid: value || !required ? true : false,
    });
  };

  constructor(props) {
    super(props);
    this.INDUSTRIES = INDUSTRIES.map(suggestion => ({
      value: suggestion.industry,
      label: props.i18n.t('industries:' + suggestion.industry),
    }));
  }

  componentDidMount(props) {
    console.log('company', this.props.companies, this.props.companyId);
    this.props.companies.map(company => {
      console.log(company, this.props.companyId);
      if (company.id === parseInt(this.props.companyId)) {
        /*alert(
          JSON.stringify({
            industry: {
              value: company.Industry,
              label: this.props.i18n.t('industries:' + company.Industry),
            },
          }),
        );*/
        this.setState({
          company: company,
          industry: {
            value: company.Industry,
            label: this.props.i18n.t('industries:' + company.Industry),
          },
        });
      }
    });
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
    console.log(JSON.stringify(value));
    if (value) {
      this.setState({industry: value, industryvalid: true});
    } else {
      this.setState({industry: value, industryvalid: false});
    }
  };

  handleChange = event => {
    console.log(event.target.name, event.target.value, {
      ...this.state.company,
      ...{
        [event.target.name]: event.target.value,
      },
    });
    console.log('lolname', this.state.company.name);
    this.setState({
      company: {
        ...this.state.company,
        ...{
          [event.target.name]: event.target.value,
        },
      },
    });
  };

  upload = file => {
    console.log(file.target.files);
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    console.log(formData);
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

  saveCompany = () => {
    const newCompany = {
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
				$Industry: String!) {
				  update_Company(where: {id: {_eq: $id}},_set: {
					ownerId: $ownerId,
					name: $name,
					url: $url,
					description: $description,
					yearFounded: $yearFounded,
					Industry: $Industry

				}){
					returning{
					  id
					  name
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

    client.request(createCompanyopts.query, newCompany).then(gdata => {
      this.handleUpdateCallback();
    });
  };

  render(props) {
    const {classes, job, i18n} = this.props;
    const {open} = this.state;
    const industries = this.INDUSTRIES;
    return (
      <Grid container spacing={24} alignItems="center" justify="center">
        <Grid item xs={24} md={8}>
          <div style={{background: 'white'}}>
            <form>
              <FormControl
                className={classes.formControl}
                error={this.state.namevalid === false}>
                <InputLabel htmlFor="name-simple">{i18n.t('Name')}</InputLabel>
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
                    : i18n.t('The year your company was founded is required')}
                </FormHelperText>
              </FormControl>
              <FormControl
                className={classes.formControl}
                error={this.state.industryvalid === false}>
                <DownshiftSelect
                  i18n={i18n}
                  suggestions={industries}
                  defaultInputValue={this.state.industry}
                  label={this.state.industry.label || i18n.t('Industry')}
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
                    ? i18n.t("Select your company's industry")
                    : i18n.t("Selecting your company's industry is required")}
                </FormHelperText>
              </FormControl>
              <FormControl
                className={classes.formControl}
                error={this.state.namevalid === false}>
                <InputLabel htmlFor="name-simple">{i18n.t('Logo')}</InputLabel>
                <Input
                  id="name-simple"
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
              </FormControl>
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
                  {this.props.i18n.t('Company updated')}
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
    );
  }
}

EditCompany.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditCompany);
