/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MUIPlacesAutocomplete, {
  geocodeBySuggestion,
} from 'mui-places-autocomplete';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },

  card: {
    display: 'flex',
    marginTop: 10,
    marginBottom: 10,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  chip: {
    marginTop: 10,
    marginRight: 10,
  },
  chiptags: {
    color: '#fff',
    marginTop: 10,
    marginRight: 10,
  },
});

// get language from query parameter or url path
const lang = 'fr';

class PlacesSelect extends React.Component {
  state = {
    open: false,
  };
  constructor(props) {
    super(props);
  }

  onSuggestionSelected(suggestion) {
    // Once a suggestion has been selected by your consumer you can use the utility geocoding
    // functions to get the latitude and longitude for the selected suggestion.
    const fullAddress = geocodeBySuggestion(suggestion)
      .then(results => {
        if (results.length < 1) {
          console.log(
            'Geocode request completed successfully but without any results',
          );

          return;
        }

        // Just use the first result in the list to get the geometry coordinates
        const {geometry} = results[0];

        const coordinates = {
          lat: geometry.location.lat(),
          lng: geometry.location.lng(),
        };

        // Add your business logic here. In this case we simply set our state to show our <Snackbar>.
        const componentForm = {
          street_number: 'short_name',
          route: 'long_name',
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name',
        };

        const fullAddress = {
          street_number: '',
          route: '',
          locality: '',
          administrative_area_level_1: '',
          country: '',
          postal_code: '',
        };
        const place = results[0];
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            fullAddress[addressType] =
              place.address_components[i][componentForm[addressType]];
          }
        }
        this.setState({
          fullAddress: fullAddress,
        });
        this.that.setState({
          fullAddress: fullAddress,
          currentAddressDescription: suggestion.description,
          coordinates: coordinates,
        });
        console.log('select', this.that);
        return fullAddress;
      })
      .catch(err => {
        console.log({open: true, errorMessage: err.message});
      });
  }

  render(props) {
    const {classes, placeholder, parentOnSuggestionSelected, that} = this.props;
    const {open} = this.state;

    this.that = that;
    return (
      <MUIPlacesAutocomplete
        textFieldProps={{
          fullWidth: true,
          placeholder: this.state.currentAddressDescription || placeholder,
        }}
        onSuggestionSelected={this.onSuggestionSelected.bind(this)}
        renderTarget={() => <span />}
      />
    );
  }
}

PlacesSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlacesSelect);
