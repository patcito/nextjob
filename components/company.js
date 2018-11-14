/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

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
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
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
const styles = theme => ({
  card: {
    width: '100%',
    marginTop: 10,
    marginRight: 10,
  },

  cardActionArea: {
    width: '100%',
  },
  media: {
    width: '100%',
    height: 200,
  },
});

// get language from query parameter or url path
const lang = 'fr';

class Company extends React.Component {
  state = {
    open: false,
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

  handleDistanceChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleSwitchChange = name => event => {
    this.setState({[name]: event.target.checked});
  };
  constructor(props) {
    super(props);
  }

  render(props) {
    const {classes, company, i18n, query} = this.props;
    const {open} = this.state;

    return (
      <Card className={classes.card}>
        <Link href={'/companies/' + company.id}>
          <CardActionArea className={classes.cardActionArea}>
            <CardMedia
              className={classes.media}
              image={
                '/' + company.id + '-' + company.ownerId + '-' + 'logo.png'
              }
              title="Contemplative Reptile"
            />

            <CardContent className={classes.card}>
              <Typography gutterBottom variant="headline" component="h2">
                {company.name}
              </Typography>
              <Typography component="p">{company.description}</Typography>
            </CardContent>
          </CardActionArea>
        </Link>
        <CardActions>
          <Link href={'/jobs/companies/' + company.id}>
            <Button size="small" color="primary">
              {i18n.t('JOBS')}
            </Button>
          </Link>
          {query.me ? (
            <Link href={'/companies/' + company.id + '/edit'}>
              <Button size="small" color="primary">
                {i18n.t('edit')}
              </Button>
            </Link>
          ) : (
            <Link href={'/jobs/companies/' + company.id}>
              <Button size="small" color="primary">
                {i18n.t('common:Learn More')}
              </Button>
            </Link>
          )}
        </CardActions>
      </Card>
    );
  }
}

Company.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Company);
