import React, { Component } from "react";
import firebase from "../myFirebaseConfig.js"; // import the firebase app
import "firebase/firestore"; // attach firestore
import ISO from "./names.json";
import "./TripForm.css";
import UploadPhotos from "../uploadPhotos/uploadPhotos.js";

// declare global variable for use in componentDidMount & addData
const firestore = firebase.firestore(); // collection = users & user = evan

// create a trip class to store custom object in firestore
class Trip {
  constructor(country, startDate, endDate) {
    this.country = country;
    this.startDate = startDate;
    this.endDate = endDate;
  }
  // will transform data to an object for adding to array
  // and in mapping to trip list
  toObject() {
    return {
      country: this.country,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }
}

// implenting firestore documentation code here for the
// transfer of custom objects
var tripConverter = {
  toFirestore: function (trip) {
    return {
      country: trip.country,
      startDate: trip.startDate,
      endDate: trip.endDate,
    };
  },
  fromFirestore: function (snapshot, options) {
    const trip = snapshot.data(options);
    return new Trip(trip.country, trip.startDate, trip.endDate);
  },
};

class TripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // ${this.props.currentUser.uid} passed down from Landing.js file
      docRef: firestore.collection("users").doc(localStorage.getItem("uid")),
      //.doc(`${this.props.currentUser.uid}`),
      locationRef: firestore
        .collection("users")
        .doc(localStorage.getItem("uid"))
        //.doc(`${this.props.currentUser.uid}`)
        .collection("locations"),
      tripRef: firestore
        .collection("users")
        .doc(localStorage.getItem("uid"))
        //.doc(`${this.props.currentUser.uid}`)
        .collection("trips"),
      trips: [],
    };
    this.addData = this.addData.bind(this);
    this.getKeyByValue = this.getKeyByValue.bind(this);
  }
  // function that will add data to firestore
  addData(event) {
    // add try catch to prevent firestore error on invalid input
    try {
      event.preventDefault(); // prevent the form from actually submitting
      var country = document.getElementById("country");
      var startDate = document.getElementById("startdate");
      var endDate = document.getElementById("enddate");
      const docID = country.value;
      const userSeries = {
        location: {
          id: this.getKeyByValue(ISO, country.value),
          name: country.value,
          fill: `amd4color("#000")`,
        },
      };
      const userTrips = {
        tripInfo: {
          name: country.value,
          startDate: startDate.value,
          endDate: endDate.value,
        },
      };
      this.state.locationRef.doc(`${docID}`).set(userSeries);
      this.state.tripRef
        .doc(`${docID}`)
        .withConverter(tripConverter)
        .set(new Trip(country.value, startDate.value, endDate.value));
      console.log("trip added");
    } catch (error) {
      alert("invalid input");
      console.error(error);
    }
  }
  // gets ISO for user chosen country
  getKeyByValue(object, value) {
    return Object.keys(object).find(
      (key) => object[key].toLowerCase() === value.toLowerCase()
    );
  }

  componentDidMount() {
    this.state.tripRef.withConverter(tripConverter).onSnapshot((docs) => {
      if (!docs.empty) {
        var arr = [];
        docs.forEach((doc) => {
          var trip = doc.data();
          arr.push(trip.toObject());
        });
        this.setState({ trips: arr });
      } else {
        console.log("No document");
      }
    });
  }

  render() {
    console.log(this.state.trips);
    return (
      <>
        <form className="trip-form" onSubmit={this.addData}>
          {/* onSubmit={()=> {this.addData; this.handleSubmission;} } */}
          <h1>Your Trip</h1>
          <div id="inputContainer">
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter Country"
            />
            <input
              type="text"
              id="startdate"
              name="startdate"
              placeholder="Enter Start Date"
            />
            <input
              type="text"
              id="enddate"
              name="enddate"
              placeholder="Enter End Date"
            />
          </div>
          <div id="buttonContainer">
            <input type="submit" id="submit" value="Submit" />
          </div>
        </form>

        <div className="tripList">
          <h4>list the trips here</h4>
          {this.state.trips.map((trip, index) => (
            <div key={index}>
              {trip.country}
              <div>from : {trip.startDate}</div>
              <div>to : {trip.endDate}</div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default TripForm;
