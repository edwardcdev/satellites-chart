import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import ChartPanel from './views/chart-panel';
import CartDashPanel from './views/caesar';
import NoMatch from './views/auth-panel/NoMatch';

const App: React.FC = () => {
  return (
    <SnackbarProvider dense maxSnack={3}>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={CartDashPanel} />
          <Route exact path="/home" component={ChartPanel} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </HashRouter>
    </SnackbarProvider>
  );
};

export default App;
