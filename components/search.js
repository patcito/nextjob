/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Link from 'next/link';
import SearchBar from 'material-ui-search-bar';
import DownshiftSelect from '../components/downshift';
import Router from 'next/router';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },

  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    minWidth: 120,
    marginTop: -10,
  },
  filters: {
    '@media (max-width: 728px)': {},
  },
  remotexs: {
    '@media (min-width: 728px)': {
      display: 'none',
    },
  },
  remote: {
    '@media (max-width: 728px)': {
      display: 'none',
    },
    '@media (min-width: 728px)': {
      alignContent: 'flex-end',
      alignItems: 'flex-end',
    },
  },
});

// get language from query parameter or url path
const lang = 'fr';

class SearchFilters extends React.Component {
  state = {
    open: false,
    remote: false,
    FullTime: false,
    Permanent: false,
    PartTime: false,
    Contract: false,
    Temporary: false,
    Volunteer: false,
    Internship: false,
    showFilter: 'none',
    value: 0,
    q: '',
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
    classes.filters = {};
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  search = q => {
    console.log(Router.query);
    Router.push({
      pathname: Router.pathname,
      query: {...Router.query, ...{description: q}},
    });
  };

  handleChangeTab = (event, value) => {
    let path = Router.pathname;
    let state = {skill: value};
    let query = {...Router.query, ...{skill: value}};
    if (value === 0) {
      value = null;
      path = '/';
      query = {};
      state = {
        skill: null,
        description: null,
        employementType: null,
        remote: false,
        FullTime: false,
        Permanent: false,
        PartTime: false,
        Contract: false,
        Temporary: false,
        Volunteer: false,
        Internship: false,
        country: null,
        locality: null,
      };
    }
    this.setState(state);
    this.forceUpdate();
    console.log(this);
    Router.push({
      pathname: path,
      query: query,
    });
  };

  handleChange = (event, value) => {
    this.setState({value});
  };

  handleChangeCountry = value => {
    this.setState({country: value});
  };

  handleDistanceChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handlejobEmployementType = (jET, query, event) => {
    if (!event.target.checked && query.jobEmployementType) {
      query.jobEmployementType = query.jobEmployementType.replace(jET, '');
      if (
        query.jobEmployementType === '' ||
        query.jobEmployementType === '%2C' ||
        query.jobEmployementType === ','
      ) {
        delete query.jobEmployementType;
      }
    } else {
      query.jobEmployementType
        ? (query.jobEmployementType = query.jobEmployementType + ',' + jET)
        : (query.jobEmployementType = jET);
    }
    return query;
  };
  handleSwitchChange = name => event => {
    this.setState({[event.target.name]: !this.state[event.target.name]});
    let query = Router.query;
    switch (name) {
      case 'Remote':
        if (!event.target.checked) {
          delete query.remote;
        } else {
          query.remote = true;
        }
        break;
      case 'FullTime':
        query = this.handlejobEmployementType('FullTime', query, event);
        break;
      case 'PartTime':
        query = this.handlejobEmployementType('PartTime', query, event);
        break;
      case 'Contract':
        query = this.handlejobEmployementType('Contract', query, event);
        break;
      case 'Temporary':
        query = this.handlejobEmployementType('Temporary', query, event);
        break;
      case 'Volunteer':
        query = this.handlejobEmployementType('Volunteer', query, event);
        break;
      case 'Internship':
        query = this.handlejobEmployementType('Internship', query, event);
        break;
      case 'Permanent':
        query = this.handlejobEmployementType('Permanent', query, event);
        break;
    }
    Router.push({
      pathname: Router.pathname,
      query: query,
    });
  };
  constructor(props) {
    super(props);
  }
  handleChangeJobLocation = value => {
    if (value) {
      this.setState({jobLocation: value});
      console.log(this.state.jobLocation);
      Router.push({
        pathname: Router.pathname,
        query: {
          ...Router.query,
          ...{country: value.value.country, locality: value.value.locality},
        },
      });
    }
  };

  handleBlurJobLocation = (value, required) => {};

  componentDidMount() {
    console.log('remote', this.state.remote);
    if (Router && Router.query && Router.query.remote === 'true') {
      this.setState({remote: true});
    }
    if (Router && Router.query && Router.query.jobEmployementType) {
      if (Router.query.jobEmployementType.indexOf('FullTime') > -1) {
        this.setState({FullTime: true});
      }
      if (Router.query.jobEmployementType.indexOf('PartTime') > -1) {
        this.setState({PartTime: true});
      }
      if (Router.query.jobEmployementType.indexOf('Contract') > -1) {
        this.setState({Contract: true});
      }
      if (Router.query.jobEmployementType.indexOf('Temporary') > -1) {
        this.setState({Temporary: true});
      }
      if (Router.query.jobEmployementType.indexOf('Volunteer') > -1) {
        this.setState({Volunteer: true});
      }
      if (Router.query.jobEmployementType.indexOf('Internship') > -1) {
        this.setState({Internship: true});
      }
      if (Router.query.jobEmployementType.indexOf('Permanent') > -1) {
        this.setState({Permanent: true});
      }
    }
  }
  render(props) {
    const {classes, group_by_location} = this.props;
    const {open} = this.state;
    const i18n = this.props.i18n;
    const {value} = this.state;
    let cities = [];
    (group_by_location || []).map(
      location =>
        location && location.locality && location.country
          ? cities.push({
              value: location,
              label: location.locality + ' (' + location.country + ')',
            })
          : location.country
            ? cities.push({value: location, label: location.country})
            : null,
    );

    return (
      <Toolbar>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={classes.root}>
              <Tabs
                value={this.state.skill}
                onChange={this.handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                scrollable
                scrollButtons="auto">
                <Tab label="All" />
                <Tab label="React.js" value="React.js" />
                <Tab label="React Native" value="React Native" />
                <Tab label="Expo" value="Expo" />
                <Tab label="GraphQL" value="GraphQL" />
                <Tab label="React SSR" value="React SSR" />
                <Tab label="Next.js" value="Next.js" />
                <Tab label="Redux" value="Redux" />
                <Tab label="MobX" value="MobX" />
                <Tab label="Jest" value="Jest" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <SearchBar
              placeholder={i18n.t('Search')}
              value={this.state.q}
              onChange={newValue => this.setState({value: newValue})}
              onRequestSearch={this.search}
            />
          </Grid>

          <Grid item xs={7} md={3} className={classes.filters}>
            <div style={{marginTop: '6px'}}>
              <DownshiftSelect
                i18n={this.i18n}
                defaultInputValue={this.state.jobLocation}
                suggestions={cities}
                label={i18n.t('Where?')}
                handleParentChange={this.handleChangeJobLocation}
                handleParentBlur={this.handleBlurJobLocation}
                name="jobLocation"
                id="jobLocation"
              />
            </div>
          </Grid>
          <Grid item xs={5} md={3} className={classes.filters}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Distance</InputLabel>
              <Select
                native
                value={this.state.distance}
                onChange={this.handleDistanceChange('distance')}
                inputProps={{
                  name: 'distance',
                  id: 'distance-native-simple',
                }}>
                <option value="" />
                <option value={2}>2km</option>
                <option value={5}>5km</option>
                <option value={10}>10km</option>
                <option value={20}>20km</option>
                <option value={30}>30km</option>
                <option value={40}>40km</option>
                <option value={50}>50km</option>
                <option value={100}>100km</option>
                <option value={200}>200km</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={10} className={classes.filters}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.FullTime}
                    name="FullTime"
                    onChange={this.handleSwitchChange('FullTime')}
                    value="FullTime"
                  />
                }
                label={i18n.t('employementtypes:FullTime')}
              />
              <FormControlLabel
                control={
                  <Switch
                    name="PartTime"
                    checked={this.state.PartTime}
                    onChange={this.handleSwitchChange('PartTime')}
                    value="PartTime"
                  />
                }
                label={i18n.t('employementtypes:PartTime')}
              />
              <FormControlLabel
                control={
                  <Switch
                    name="Contract"
                    checked={this.state.Contract}
                    onChange={this.handleSwitchChange('Contract')}
                    value="Contract"
                  />
                }
                label={i18n.t('employementtypes:Contract')}
              />
              <FormControlLabel
                control={
                  <Switch
                    name="Temporary"
                    checked={this.state.Temporary}
                    onChange={this.handleSwitchChange('Temporary')}
                    value="Temporary"
                  />
                }
                label={i18n.t('employementtypes:Temporary')}
              />
              <FormControlLabel
                control={
                  <Switch
                    name="Internship"
                    checked={this.state.Internship}
                    onChange={this.handleSwitchChange('Internship')}
                    value="Internship"
                  />
                }
                label={i18n.t('employementtypes:Internship')}
              />
            </FormGroup>
            <FormGroup row className={classes.remotexs}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.remote}
                    name="remote"
                    onChange={this.handleSwitchChange('Remote')}
                    value="Remote"
                  />
                }
                label={i18n.t('Remote')}
              />
            </FormGroup>
          </Grid>
          <Grid item md={2} flex="true" className={classes.remote}>
            <FormGroup row className={classes.remote}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.remote}
                    name="remote"
                    onChange={this.handleSwitchChange('Remote')}
                    value="Remote"
                  />
                }
                label={i18n.t('Remote')}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Toolbar>
    );
  }
}

SearchFilters.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchFilters);
