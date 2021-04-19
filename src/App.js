import React, { Component } from "react";
import { Container, Row} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Rego from "./components/rego/rego";
import ContactUs from "./components/contactUs/ContactUs";
import firebase from "./components/myFirebaseConfig";
import Firebase from "firebase/app";
import About from "./components/about/About";
import Logout from "./components/Logout/logout.js";
import MapView from "./views/MapView/MapView.js";
import Preloginmap from "./views/PreLoginMap/Preloginmap";
import Login from "./components/Login/login.js";
import { createHashHistory } from "history";
import ForgotPass from "./components/ForgotPassword/forgotPass.js";
import NavBar from "./components/NavBar/NavBar.js";
import UploadPhotos from "./components/uploadPhotos/uploadPhotos.js";
import Gallery from "./components/photoGallery/gallery.js";
import TripForm from "./components/TripForm/TripForm.js";
import Footer from "./components/footer/Footer.js";
import Profile from "./components/Profile/profile.js";
import Settings from "./components/settings/Settings.js";
// import MapView from "./views/MapView/MapView";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      currentUser: null,
    };
    this.getMessagesFromDatabase = this.getMessagesFromDatabase.bind(this);
  }
  async componentDidMount() {
    try {
      this.getMessagesFromDatabase();
    } catch (error) {
      console.log(error);
      this.setState({ errorMsg: error });
    } // end of try catch
  } // end of componentDidMount()
  getMessagesFromDatabase() {
    //for importing data from our FIREBASE database
    let ref = Firebase.database().ref("");

    ref.on("value", (snapshot) => {
      // json array
      let msgData = snapshot.val();
      let newMessagesFromDB1 = [];
      for (let m in msgData) {
        // create a JSON object version of our object.
        let currObject = {
          id: msgData[m].id,
        };
        // add it to our newStateMessages array.
        newMessagesFromDB1.push(currObject);
      } // end for loop
      // set state
      this.setState({ users: newMessagesFromDB1 });
    });
  }
  //check if user is authenticated,
  // if they are set to true, otherwise false
  // currentUser holds the user object (if logged on)
  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
      user
        ? this.setState(() => ({
          authenticated: true,
          currentUser: user,
        }))
        : this.setState(() => ({
          authenticated: false,
          currentUser: null,
        }));
    });
  }

  render() {
    if (this.state.authenticated) {
      localStorage.setItem("uid", this.state.currentUser.uid);
      localStorage.setItem("email", this.state.currentUser.email);
    }
    //else localStorage.setItem("uid", "K26KJF569YU6gNaIZOySCG6uoGB2");
    // prevents error when /mapview is directly typed into the url

    //extract url information from browser (https://stackoverflow.com/a/52732656)
    let location = window.location.pathname;
    return (
      /*change the css class based on browser location*/
      <Container fluid className={
        location !== "/" && location !== "/mapview" && location !== "/preloginmap"
        ? "content pictureBackground" : "content "}>
        <Router>
          <Row>
            <NavBar authenticated={this.state.authenticated} />
          </Row>
          <Row>
            <Switch>
              <Route path="/" component={Preloginmap} exact />
              <Route path="/about" component={About} />
              <Route
                path="/mapview"
                render={() => (
                  <MapView
                    authenticated={this.state.authenticated}
                    currentUser={this.state.currentUser}
                  />
                )}
              />
              <Route path="/preloginmap" component={Preloginmap} />
              <Route path="/contactus" component={ContactUs} />
              <Route path="/login" component={Login} />
              <Route
                path="/tripform"
                render={() => (
                  <TripForm
                    authenticated={this.state.authenticated}
                    currentUser={this.state.currentUser}
                  />
                )}
              />
              <Route path="/logout"
                render={() => (
                  <Logout
                    currentUser={this.state.currentUser} />
                )} />
              <Route path="/register" component={Rego} />
              <Route path="/forgotPass" component={ForgotPass} />
              <Route path="/settings" component={Settings} />
              <Route
                path="/uploadPhotos"
                render={() => (
                  <UploadPhotos
                    authenticated={this.state.authenticated}
                    currentUser={this.state.currentUser}
                  />
                )}
              />
              <Route
                path="/gallery"
                render={() => (
                  <Gallery
                    authenticated={this.state.authenticated}
                    currentUser={this.state.currentUser}
                  />
                )}
              />
              <Route
                path="/profile"
                render={() => (
                  <Profile authenticated={this.state.authenticated} />
                )}
              />
            </Switch>
          </Row>
          <Row>
            <Footer currentUser={this.state.currentUser} />
          </Row>
        </Router>
        </Container>
    );
  }
}
export default App;
