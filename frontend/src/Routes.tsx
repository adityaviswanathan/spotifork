import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

import { Home, Login, SignUp, Player, Protected, PrivateRoute } from './views';
import { Admin } from './admin';
import { logout } from './utils/auth';

const useStyles = makeStyles((theme) => ({
  app: {
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
}));

export const Routes: FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div>
      <Route path="/admin" component={Admin} />
      <div className={classes.app}>
        <header className={classes.header}>
          <Route path="/player" component={Player} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route
            path="/logout"
            render={() => {
              logout();
              history.push('/');
              return null;
            }}
          />
          <PrivateRoute path="/protected" component={Protected} />
          <Route exact path="/" component={Home} />
        </header>
      </div>
    </div>
  );
};
