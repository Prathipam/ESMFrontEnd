import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserList from './pages/Users/UserList';
import UserEdit from './pages/Users/UserEdit';
import UserUpload from './pages/Users/UserUpload'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path='/users' exact={true} component={UserList} />
          <Route path='/users/:id' component={UserEdit} />
          <Route path='/users_upload' component={UserUpload} />
        </Switch>
      </Router>
    )
  }
}

export default App;