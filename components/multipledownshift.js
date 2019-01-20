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
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

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

class MultipleIntegrationDownshift extends React.Component {
  state = {
    inputValue: '',
    selectedItem: [],
  };

  handleKeyDown = (event, handleParentChange) => {
    const {inputValue, selectedItem} = this.state;
    if (
      selectedItem.length &&
      !inputValue.length &&
      keycode(event) === 'backspace'
    ) {
      let newSelectedItems = selectedItem.slice(0, selectedItem.length - 1);
      this.setState({
        selectedItem: newSelectedItems,
      });
      handleParentChange(newSelectedItems);
    }
  };

  handleInputChange = event => {
    this.setState({inputValue: event.target.value});
  };

  handleChange = (item, handleParentChange, maxSelection) => {
    let {selectedItem} = this.state;
    console.log('multiple', selectedItem);
    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }
    if (selectedItem.length <= maxSelection) {
      this.setState({
        inputValue: '',
        selectedItem,
      });
      handleParentChange(selectedItem);
    }
  };

  handleDelete = (item, handleParentChange) => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      handleParentChange(selectedItem);
      return {selectedItem};
    });
  };

  componentDidMount(props) {
    this.setState({
      selectedItem: this.props.selectedItems,
    });
  }
  render() {
    const {inputValue, selectedItem} = this.state;

    const {classes} = this.props;
    const suggestions = this.props.suggestions;
    const handleParentChange = this.props.handleParentChange;
    const label = this.props.label;
    const placeholder = this.props.placeholder;
    const maxSelection = this.props.maxSelection;
    const handleChange = item => {
      console.log('seli', item);
      return item.label;
    };

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={e => this.handleChange(e, handleParentChange, maxSelection)}
        selectedItem={selectedItem}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={JSON.stringify(item.value)}
                    tabIndex={-1}
                    label={item.label}
                    className={classes.chip}
                    onDelete={this.handleDelete(item, handleParentChange)}
                  />
                )),
                onChange: this.handleInputChange,
                //onChange={this.handleChange('single', handleParentChange)}
                onKeyDown: e => this.handleKeyDown(e, handleParentChange),
                placeholder: placeholder,
              }),
              label: label,
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue2, suggestions).map(
                  (suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({item: suggestion}),
                      highlightedIndex,
                      selectedItem: selectedItem2,
                    }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

MultipleIntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

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
    maxHeight: 300,
    overflowY: 'scroll',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  divider: {},
});

export default withStyles(styles)(MultipleIntegrationDownshift);
