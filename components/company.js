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
import getConfig from 'next/config';
import removeMd from 'remove-markdown';
import supportsWebP from 'supports-webp';
import slugify from 'slugify';
import ellipsis from 'text-ellipsis';

let ext = 'png';
supportsWebP ? (ext = 'webp') : (ext = 'png');

const {publicRuntimeConfig} = getConfig();
const styles = theme => ({
  card: {
    '@media (min-width: 728px)': {
      marginTop: 10,
      width: '100%',
      marginRight: 10,
    },
    '@media (max-width: 728px)': {},
  },
  cover: {
    backgroundColor: '#fff',
    marginTop: '-80px',
    '@media (min-width: 728px)': {
      width: 70,
      height: 70,
    },
    '@media (max-width: 728px)': {
      width: 70,
      height: 70,
      marginTop: 5,
      marginLeft: 5,
      img: {
        width: 50,
        height: 50,
      },
    },
  },

  cardActionArea: {
    width: '100%',
  },
  media: {
    width: '100%',
    height: 200,
    backgroundSize: 'contain',
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
        <Link href={'/companies/' + company.id + '/' + slugify(company.name)}>
          <CardActionArea className={classes.cardActionArea}>
            <CardMedia
              className={classes.media}
              image={
                publicRuntimeConfig.cdn +
                company.id +
                '-' +
                (company.media1 && company.media1.published
                  ? '1media.' + ext
                  : 'logo.' + ext) +
                '?updatedAt=' +
                company.updatedAt
              }
              title="Contemplative Reptile"
            />

            <CardContent className={classes.card}>
              <CardMedia
                className={classes.cover}
                image={
                  publicRuntimeConfig.cdn +
                  company.id +
                  '-' +
                  'logo.' +
                  ext +
                  '?u=' +
                  company.updatedAt
                }
                title={company.name}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="headline">{company.name}</Typography>
                  <Typography variant="subheading" color="textSecondary" />
                  <Typography>
                    {i18n.language === 'fr' && company.description_fr
                      ? removeMd(ellipsis(company.description_fr + '', 40))
                      : removeMd(ellipsis(company.description + '', 40))}
                  </Typography>
                </CardContent>
              </div>
            </CardContent>
          </CardActionArea>
        </Link>
        <CardActions>
          {query.me ? (
            <>
              <Link href={'/jobs/companies/' + company.id + '/team'}>
                <Button size="small" color="primary">
                  {i18n.t('JOBS')}
                </Button>
              </Link>
              <Link href={'/companies/' + company.id + '/edit'}>
                <Button size="small" color="primary">
                  {i18n.t('edit')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={
                  '/jobs/companies/' + company.id + '/' + slugify(company.name)
                }>
                <Button size="small" color="primary">
                  {i18n.t('JOBS')}
                </Button>
              </Link>
              <Link
                href={'/companies/' + company.id + '/' + slugify(company.name)}>
                <Button size="small" color="primary">
                  {i18n.t('common:Learn More')}
                </Button>
              </Link>
            </>
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
