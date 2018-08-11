/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import {emphasize} from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    fontSize: 16,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({inputRef, ...props}) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      name={props.selectProps.name}
      onBlur={(e, r, t) => {
        console.log('bbbbbbindusblur', this, e, r, t);
        props.selectProps.onBlur(
          props.selectProps.value,
          props.selectProps.required,
        );
      }}
      InputProps={{
        inputComponent,
        inputProps: {
          onBlur: (e, r, t) => {
            console.log('ccccccccccindusblur', this, e, r, t);
            props.selectProps.onBlur(
              props.selectProps.value,
              props.selectProps.required,
            );
          },
          name: props.selectProps.name,
          className: props.selectProps.classes.input,
          ref: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}>
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={event => {
        props.removeProps.onClick();
        props.removeProps.onMouseDown(event);
      }}
    />
  );
}

const components = {
  Option,
  Control,
  NoOptionsMessage,
  Placeholder,
  SingleValue,
  MultiValue,
  ValueContainer,
};

class SingleSelect extends React.Component {
  state = {
    single: null,
    multi: null,
  };

  handleChange = (name, handleParentChange) => value => {
    this.setState({
      [name]: value,
    });
    handleParentChange(value.value);
  };

  handleBlur = (event, required, handleParentBlur) => value => {
    console.log('HANDLE BLUR', required);
    handleParentblur(event, required);
  };

  constructor(props) {
    super(props);
  }

  render(props) {
    const {classes} = this.props;
    const i18n = this.props.i18n;
    const suggestions = this.props.suggestions;
    const label = this.props.label;
    const handleParentChange = this.props.handleParentChange;
    const handleParentBlur = this.props.handleParentBlur;
    const required = this.props.required;
    const name = this.props.name;
    return (
      <Select
        id="singleSelect"
        classes={classes}
        options={suggestions}
        components={components}
        value={this.state.single}
        onChange={this.handleChange('single', handleParentChange)}
        placeholder={label}
        name={this.props.name}
        required={required}
        onBlur={(e, r, t) => {
          console.log('zzzzzzindusblur', this);
          handleParentBlur(this, required);
        }}
        //        onBlur={handleParentBlur}
      />
      /*{' '}
        <Select
          classes={classes}
          options={suggestions}
          components={components}
          value={this.state.multi}
          onChange={this.handleChange('multi')}
          placeholder="Select multiple countries"
          isMulti
        />
        */
    );
  }
}

SingleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SingleSelect);
