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
import SingleSelect from '../components/select';
import COUNTRIES from '../data/countries';

const countries = COUNTRIES.map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

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
  remote: {
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

// get language from query parameter or url path
const lang = 'fr';

class SearchFilters extends React.Component {
  state = {
    open: false,
    value: 0,
    q: '',
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
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

  handleSwitchChange = name => event => {
    this.setState({[name]: event.target.checked});
  };
  constructor(props) {
    super(props);
    this.countries = countries;
  }

  render(props) {
    const {classes} = this.props;
    const {open} = this.state;
    const i18n = this.props.i18n;
    const {value} = this.state;

    return (
      <Toolbar>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={classes.root}>
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                scrollable
                scrollButtons="auto">
                <Tab label="React.js" />
                <Tab label="React Native" />
                <Tab label="Expo" />
                <Tab label="GraphQL" />
                <Tab label="React SSR" />
                <Tab label="Next.js" />
                <Tab label="Jest" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <SearchBar
              placeholder={i18n.t('Search')}
              value={this.state.q}
              onChange={newValue => this.setState({value: newValue})}
              onRequestSearch={() => doSomethingWith(this.state.value)}
            />
          </Grid>
          <Grid item xs={7} md={3}>
            <SingleSelect
              i18n={i18n}
              suggestions={this.countries}
              id="react-select-2-input"
              label={i18n.t('Where?')}
              handleParentChange={this.handleChangeCountry}
            />
          </Grid>
          <Grid item xs={5} md={3}>
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
          <Grid item xs={10}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleSwitchChange('Permanent')}
                    value="Permanent"
                  />
                }
                label={i18n.t('CDI')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleSwitchChange('Temporary')}
                    value="Temporary"
                  />
                }
                label={i18n.t('CDD')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleSwitchChange('Freelance')}
                    value="Freelance"
                  />
                }
                label={i18n.t('Freelance')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleSwitchChange('Internship')}
                    value="Internship"
                  />
                }
                label={i18n.t('Internship')}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={2} flex="true" className={classes.remote}>
            <FormGroup row className={classes.remote}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
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
