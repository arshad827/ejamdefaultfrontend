
import React from 'react';

import './App.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
  card: {
    margin: 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
function App() {
  const classes = useStyles();

  // Hardcoded city data
  let cityData = [{ "name": "New York", "zipCode": "10001" }, { "name": "Chicago", "zipCode": "60007" }, { "name": "Washington, D.C.", "zipCode": "20001" }];

  const [checked, setChecked] = React.useState([]);
  const [isLoading, setIsloading] = React.useState(false);
  const [respData, setRespData] = React.useState([]);


  let newChecked;

  const handleToggle = value => () => {
    const currentIndex = checked.findIndex(x => x.name === value.name);
    newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    // set new Value
    setChecked(newChecked);
  };
  // API Call
  function handleClick() {
    setIsloading(true);
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.post(`http://localhost:3000/getWeatherByZipcodes`, checked)
      .then(res => {
        setRespData(res.data);
        setChecked([]);
        setIsloading(false);
      })
  }
  return (
    <div className="App">
      {/* Header component */}
      <header className="App-header">
        {isLoading === true ? (< div >
          <LinearProgress />
        </div>) : ('')}
      </header>
      <div>
        {/* list */}
        <List >
          {cityData.map(value => {
            const labelId = `checkbox-list-label-${value.name}`;
            return (
              <ListItem key={value.name} role={undefined} dense button onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.findIndex(x => x.name === value.name) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value.name}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments">
                    <CloudQueueIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
          }
        </List>
      </div>
      <Button color="secondary" onClick={handleClick}>Get Weather Data</Button>
      {/* Weather's data */}
      <Grid container spacing={3}>
        {respData.map(value => {
          return (
            <Grid item sm={4} xs={12} >
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {value.location.country}</Typography>
                  <Typography variant="h5" component="h2">
                    {value.location.city}</Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {value.location.timezone_id}</Typography>
                  {/* ExpantionPanel */}
                  {value.forecasts.map(value2 => {
                    return (
                      <ExpansionPanel>
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className={classes.heading}>{value2.day} {'   '}<CloudQueueIcon style={{ fontSize: "1rem", }} /></Typography >
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Weather: {value2.text}
                            <br />
                            Code: {value2.code}
                            <br />
                            Day: {value2.day}
                            <br />
                            High: {value2.high} - Low: {value2.low}
                            <br />
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    )
                  })}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </div >
  );
}

export default App;
