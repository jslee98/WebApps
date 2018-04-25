import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './App.css'

class App extends Component {

 constructor(){
    super();
    this.state = {results: "",
                  hasEntered: false}
    this.api = 'https://www.eg.bucknell.edu/~amm042/service/q?limit=1000&';
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static defaultProps = {
          // Set default filter options
          departments: ["Any", "ACFM",  "ANBE", "ANTH", "ARBC", "ARTH", "ARST",
                        "ARTR", "BIOL", "BMEG", "CHEG", "CSCI", "CHIN",
                        "CEEG", "CLAS", "ENCW", "DANC",  "EAST", "ECON",
                        "EDUC", "ECEG", "ENGR", "ENGL", "ENST", "ENFS", "FOUN",
                        "FREN", "GEOL", "GEOG", "GRMN", "GREK", "GLBM", "HEBR",
                        "HIST", "HUMN", "IDPT", "OFFJP", "JAPN", "LATN", "LAMS",
                        "LEGL", "LING", "ENLS", "MGMT", "MSUS", "MIDE", "MATH",
                        "MECH", "MILS", "MUSC", "NEUR", "OCST", "OFFAF", "OFFL",
                        "OFFD", "OFFF", "OFFAT", "OFFDN", "OFFGH", "OFFG", "OFFCB",
                        "PHIL", "PHYS","POLS", "PSCY", "RELI", "RUSS", "RESC", "SIGN",
                        "SPAN", "SOCI", "SLIF", "THEA", "UNIV", "WMST"],

          requirements: ["None", "AHLG", "ARHC", "CBL", "CCFL", "CCIP", "CCQR",
                        "DUSC", "EGHU", "EGSS", "EVCN", "FOUN", "FRST", "GBCC",
                        "GLSP", "LBSC", "NMLG", "NSMC", "RESC", "SL",  "SLSC",
                        "SSLG", "W1", "W2"],

          levels: ["Any", 100, 200, 300, 400],

          days: ["Any", "M/W/F", "T/R"]
          }

  handleSubmit(event){
    // First create the query
    var department = ""
    var ccc = ""
    if (this.refs.department.value !== "Any") {
      department = "Department=" + this.refs.department.value + "&"
    }
    if(this.refs.ccc.value !== "None"){
      ccc = "CCCReq=" + this.refs.ccc.value
    }
    var query = department + ccc

    // Second fetch the query and create list
    fetch(this.api + query)
      .then( function(response) {
          return response.json()
        })
      .then(json => this.createList(json.message))
      .catch(err => console.log("Error", err))
    event.preventDefault()
  }

  checkLevel(course) {
    // Return true if course meets level requirements, false if not
    if (this.refs.level.value === "Any") {
      return true
    } else {
      let search_level = String(this.refs.level.value).charAt(0);
      let course_level = course.Course.charAt(this.refs.department.value.length + 1)
      return search_level === course_level
    }
  }

  checkDays(course) {
    // Return true if course meets day requirements, false if not
    if (this.refs.days.value === "Any") {
      return true
    } else if (this.refs.days.value === "M/W/F") {
      if (course["Meeting Time"].indexOf('MWF') >= 0 ||
          (course["Meeting Time"].indexOf('T') < 0 &&
          course["Meeting Time"].indexOf('R') < 0) )  {
            return true
      }
    } else {
      if (course["Meeting Time"].indexOf('TR') >= 0 ||
          (course["Meeting Time"].indexOf('M') < 0 &&
          course["Meeting Time"].indexOf('W') < 0 &&
          course["Meeting Time"].indexOf('F') < 0) )  {
            return true
      } else {
        return false
      }
    }

  }

  createList(results) {
    var courseList = []
    var that = this
    if (results.length === 0) {
      this.setState({results: [],
                     hasEntered: true})
    }
    for (let i = 0; i < results.length; i++) {
      let course = results[i]
      // Filter out results based on level/day
      Promise.all([that.checkDays(course), that.checkLevel(course)])
      .then(function(criteria) {
        // Push filtered results to course list
        if(criteria[0] && criteria[1]) {
          var new_course = { crn : course.CRN,
                             title: course.Title,
                             name: course.Course,
                             time: course["Meeting Time"]
                           }
          courseList.push(course.Course + ": " + course.Title +
           ", meets " + course["Meeting Time"] + ", CRN #" + course.CRN)
        }
        // If the results have been filtered, update list view
        if(i === results.length - 1) {
          var listItems = courseList.map((courseInfo, i) => <li key = {i}> {courseInfo} </li>);
          that.setState({results: listItems, hasEntered: true})
       }
      })
    }
  }

  render() {
    // Map dropdown options
    var departments = this.props.departments.map(category => {
          return <option key={category}> {category} </option> })
    var requirements = this.props.requirements.map(category => {
          return <option key={category}> {category} </option> })
    var levels = this.props.levels.map(category => {
          return <option key={category}> {category} </option> })
    var days = this.props.days.map(category => {
          return <option key={category}> {category} </option> })

    // Render absolute footer if content doesn't fill page
    // Render sticky footer if content is scrollable
    // Render "no courses" message if no courses and have clicked button
    var res_heading = ""
    var listResults = ""
    var footer = <footer className="footer_absolute">
                    <div className="container">
                      <span className="text-muted float-right">Created by Jeff Lee</span>
                    </div>
                 </footer>
    if (this.state.results.length > 0 ) {
      res_heading = "Results:"
      listResults = this.state.results
      if (this.state.results.length > 8) {
        footer = <footer className="footer_sticky">
                  <div className="container">
                    <span className="text-muted float-right">Created by Jeff Lee</span>
                    </div>
                </footer>
      }
    } else if (this.state.hasEntered){
      res_heading = ""
      listResults = "There are no courses matching your criteria. Please try again."
    }

    return (
      <div>
      <div className="jumbotron p-4">
        <div className="container">
          <h1 className="display-4 pb-0 mb-0">CourseHunter</h1>
          <h2 className="display-5 pt-0 mt-0">Version 1.0 </h2>
          <p>
            CourseHunter is a webapp created for CSCI379 at Bucknell University.
            The goal of this app is to provide an easier way to find courses than
            the current methods provided by the school. Simply enter any combination
            of department, CCC requirement, level, and days scheduled to find your
            ideal course.
          </p>
        </div>
      </div>
      <div className = "container pt-4">

        <form onSubmit={this.handleSubmit.bind(this)}>
            <div className = "row">
              <div className = "col-3">
                  <label>Department:</label>
                  <br/>
                  <select ref="department">
                      {departments}
                  </select>
              </div>
              <div className = "col-3">
                  <label>CCC Requirement:</label>
                  <br/>
                  <select ref="ccc">
                      {requirements}
                  </select>
              </div>
              <div className = "col-3">
                  <label>Level:</label>
                  <br/>
                  <select ref="level">
                      {levels}
                  </select>
              </div>
              <div className = "col-3">
                  <label>Days:</label>
                  <br/>
                  <select ref="days">
                      {days}
                  </select>
              </div>
            </div>
            <br/>
            <center>
              <button className="btn btn-md btn-primary btn-block center-block" type="submit">
                Find Courses
              </button>
            </center>
            <br/>
          </form>
          <br/>
          <section>
            <h2 id="results"> {res_heading} </h2>
            <ul> {listResults} </ul>
          </section>
      </div>
      {footer}
      </div>)
  }
}

export default App;
