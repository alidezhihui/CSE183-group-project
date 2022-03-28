import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Login/>
        </Route>
        <Route path="/home/">
          <Home/>
        </Route> 
      </Switch>
    </BrowserRouter>
  );
}

export default App;
