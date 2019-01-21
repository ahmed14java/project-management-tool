import React, { Component } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/layout/Header";
import { BrowserRouter as Router, Route , Redirect , Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddProject from "./components/Project/AddProject";
import { Provider } from 'react-redux';
import store from './store';
import UpdateProject from "./components/Project/UpdateProject";
import ProjectBoard from "./components/ProjectBoard/ProjectBoard";
import AddProjectTask from "./components/ProjectBoard/ProjectTasks/AddProjectTask";
import UpdateProjectTask from "./components/ProjectBoard/ProjectTasks/UpdateProjectTask";
import Landing from "./components/layout/Landing";
import Register from "./components/UserManagement/Register";
import Login from "./components/UserManagement/Login";
import  jwt_decode from "jwt-decode";
import setJwtToken from './securityUtils/setJwtToken';
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/securityActions";
import SecureRoute from "./securityUtils/SecureRoute";

const jwt = localStorage.getItem('jwt');

if (jwt) {
  setJwtToken(jwt);
  const decoded_jwt = jwt_decode(jwt);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decoded_jwt
  })
  const currentTime = Date.now()/1000;
  if (decoded_jwt.exp < currentTime) {
    // handel logout
    store.dispatch(logout());
    window.location.href = '/';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            {/* public rout */}
            <Route exact path="/"  component={Landing}/>
            <Route exact path="/register"  component={Register}/>
            <Route exact path="/login"  component={Login}/>


            {/* private rout */}
            {/* <Redirect from="/" to="/dashboard" /> */}
            <Switch>
            <SecureRoute exact path="/dashboard"  component={Dashboard}/>
            <SecureRoute exact path="/add-project"  component={AddProject}/>
            <SecureRoute exact path="/update-project/:id"  component={UpdateProject}/>
            <SecureRoute exact path="/projectBoard/:id"  component={ProjectBoard}/>
            <SecureRoute exact path="/add-project-task/:id"  component={AddProjectTask}/>
            <SecureRoute exact path="/update-project-task/:backlog_id/:pt_id"  component={UpdateProjectTask}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
