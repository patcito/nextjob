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
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';

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
    '@media (max-width: 728px)': {
      margin: 5,
    },
  },
  media: {
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    backgroundSize: 'contain',
    '@media (min-width: 728px)': {
      width: 151,
      height: 151,
    },
    '@media (max-width: 728px)': {
      width: 70,
      height: 70,
      marginTop: 5,
      marginLeft: 5,
      img: {},
    },
  },
  chip: {
    marginTop: 10,
    marginRight: 10,
    '@media (max-width: 728px)': {},
  },
  chiptags: {
    color: '#fff',
    marginTop: 10,
    marginRight: 10,
  },
});

// get language from query parameter or url path
const lang = 'fr';

class Job extends React.Component {
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
    const {classes, job, i18n, i} = this.props;
    const {open} = this.state;
    console.log(i);
    return (
      <Link
        href={`/jobs/${job.id}/${slugify(
          job.JobTitle + ' at ' + job.Company.name,
        )}`}>
        <Card className={classes.card} style={{cursor: 'pointer'}}>
          <CardMedia
            className={classes.cover}
            image={
              publicRuntimeConfig.cdn +
              job.companyId +
              '-' +
              'logo.' +
              ext +
              '?u=' +
              job.Company.updatedAt
            }
            title={job.title}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="headline">{job.title}</Typography>
              <Typography variant="subheading" color="textSecondary">
                <>
                  @ {job.Company.name} {i18n.t('is looking for a')}{' '}
                  {i18n.t('jobstitles:' + job.JobTitle)}{' '}
                </>
              </Typography>
              <Typography>
                {i18n.language === 'fr' && job.Company.description_fr
                  ? removeMd(ellipsis(job.Company.description_fr + '', 120))
                  : removeMd(ellipsis(job.Company.description + '', 120))}
              </Typography>
              <Grid item>
                <div className={classes.root}>
                  <Chip
                    avatar={
                      <Avatar>
                        <PlaceIcon />
                      </Avatar>
                    }
                    label={
                      job.remote
                        ? 'remote'
                        : job.locality
                          ? job.locality
                          : job.country
                    }
                    className={classes.chip}
                  />
                  <Chip
                    avatar={
                      <Avatar>
                        <PeopleIcon />
                      </Avatar>
                    }
                    label={i18n.t(
                      job.employeeCount < 3 ? '<3 employees' : '>3 employees',
                    )}
                    className={classes.chip}
                  />
                  <Chip
                    avatar={
                      <Avatar>
                        <EuroSymbolIcon />
                      </Avatar>
                    }
                    label={
                      job.hasMonthlySalary
                        ? job.minimumMonthlySalary +
                          '-' +
                          job.maximumMonthlySalary
                        : job.minimumYearlySalary / 1000 +
                          'k' +
                          '-' +
                          job.maximumYearlySalary / 1000 +
                          'k'
                    }
                    className={classes.chip}
                  />
                  <Chip
                    avatar={
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    }
                    label={
                      new Date().getFullYear() - job.Company.yearFounded > 3
                        ? i18n.t('Company (>3 years)')
                        : i18n.t('Startup (<3 years)')
                    }
                    className={classes.chip}
                  />
                </div>
              </Grid>
              <Grid item>
                <div className={classes.root}>
                  {job.Skills.map(Skill => (
                    <Chip
                      /*onClick={e => {
                        Router.push({
                          pathname: Router.pathname,
                          query: {...Router.query, ...{skill: Skill.Skill}},
                        });
                      }}*/
                      key={Skill.Skill}
                      label={Skill.Skill}
                      className={classes.chiptags}
                      color="secondary"
                    />
                  ))}
                </div>
              </Grid>
            </CardContent>
            {this.props.query.team ? (
              <CardActions>
                <Button size="small">
                  <Link href={'/jobs/update/' + job.id}>{i18n.t('edit')}</Link>
                </Button>
              </CardActions>
            ) : null}
          </div>
        </Card>
      </Link>
    );
  }
}

Job.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Job);
