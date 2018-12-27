import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

function renderInput(inputProps) {
  const {InputProps, classes, ref, ...other} = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
  const isHighlighted = highlightedIndex === index;
  let isSelected = false;
  try {
    isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;
  } catch (e) {
    console.log(e);
  }

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}>
      {suggestion.label}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({label: PropTypes.string}).isRequired,
};

function getSuggestions(inputValue, suggestions) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue ||
        suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !==
          -1) &&
      count < 25;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  divider: {},
});

let popperNode;

function IntegrationDownshift(props) {
  const {classes} = props;
  const suggestions = props.suggestions;
  const handleParentChange = props.handleParentChange;
  const handleChange = item => {
    console.log('seli', item);
    return item.label;
  };
  return (
    <div className={classes.root}>
      <Downshift
        id="downshift-simple"
        onChange={handleParentChange}
        selectedItem={props.selectedItem}
        itemToString={item => (item ? item.label : '')}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: props.label,
                onBlur: e => handleParentChange(selectedItem),
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue, suggestions).map(
                  (suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({item: suggestion}),
                      highlightedIndex,
                      selectedItem,
                    }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
      <div className={classes.divider} />
    </div>
  );
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);
