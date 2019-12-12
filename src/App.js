import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";

const API = "https://unite-api.herokuapp.com/";
function Loading() {
  return <div className="loader" data-testid="loading"></div>;
}
async function fetchListing(id) {
  const response = await fetch(`${API}api/listings/${id}`);
  return response.json();
}
class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <nav data-testid="nav-bar">
            <ul data-testid="ul">
              <li data-testid="li">
                <NavLink to="/" exact={true}>
                  Home
                </NavLink>
              </li>
              <li data-testid="li">
                <NavLink to="/all-listings">Listings</NavLink>
              </li>
              <li data-testid="li">
                <NavLink to="/listings/new">Post A Listing</NavLink>
              </li>
              <li id="profile" data-testid="li">
                <NavLink to="/my">
                  <div height="50px" width="50px">
                    Profile
                  </div>
                </NavLink>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/" exact={true} component={HomePage}></Route>
            <Route path="/all-listings" component={ListingsPage}></Route>
            <Route path="/listing/:id" component={IndividualListing}></Route>
            <Route path="/listings/new" component={NewListing}></Route>
            <Route path="/listings/edit/:id" component={EditListing}></Route>
            <Route path="/my" component={Profile}></Route>
            <Route>
              <h5 id="pagenotfound">Page Not Found</h5>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      listings: [],
      filteredListings: [],
      loading: false
    };
  }
  async componentDidMount() {
    const response = await fetch(`${API}api/listings`);
    const json = await response.json();
    this.setState({ listings: json, filteredListings: json });
  }
  handleSearch = async searchValue => {
    this.setState({ loading: true });

    this.setState({
      filteredListings: this.state.listings.filter(post => {
        return post.header.city === searchValue;
      }),

      loading: false
    });
  };

  render() {
    return (
      <div id="homepage" data-testid="homepage">
        {this.state.loading && <Loading />}
        <div id="prompt" data-testid="prompt">
          <h1>Find The Best Place To Stay </h1>
          <h4>WORK | INTERNSHIP | SHORT TRIPS</h4>
          <SearchForm onSearch={this.handleSearch} />
        </div>
        <div id="filter" data-testid="filter"></div>
        <div>
          {" "}
          <div className="resultsList" data-testid="results-list">
            {this.state.filteredListings.map(post => {
              return (
                <ul>
                  <NavLink to={`/listing/${post.id}`} className="white">
                    <li key={post.id} className="resultsSearch">
                      {post.title}
                    </li>
                  </NavLink>
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ""
    };
  }
  handleSearchInputChange = event => {
    this.setState({
      searchValue: event.target.value
    });
  };
  handleSearch = event => {
    event.preventDefault();
    this.props.onSearch(this.state.searchValue);
  };

  render() {
    return (
      <form
        className="searchbar"
        onSubmit={this.handleSearch}
        data-testid="search-bar"
      >
        <input
          type="text"
          placeholder='Try Searching "Los Angeles"'
          className="search"
          value={this.state.searchValue}
          onChange={this.handleSearchInputChange}
          data-testid="search-input"
        />
        <button type="submit" id="submitsearch">
          Search
        </button>
      </form>
    );
  }
}
class IndividualListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      loading: true
    };
  }

  async componentDidMount() {
    const listingId = this.props.match.params.id;
    const posts = await fetchListing(listingId);

    this.setState({
      //to address undefined page
      post: posts ? posts : [],
      loading: false
    });
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <div className="details" data-testid="detail-individual">
        <div
          className="fullimage"
          style={{
            margin: "25px",
            width: "500px",
            height: "350px",
            backgroundImage: 'url("' + this.state.post.header.image + '")',
            backgroundSize: "cover",
            float: "left",
            borderRadius: "10pt",
            boxShadow: "2px 2px 10px rgb(175, 175, 175)"
          }}
        ></div>
        <div className="content">
          <h3>{this.state.post.title}</h3>
          <h4>${this.state.post.header.price}/month</h4>
          <h5>
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>
              Available from:{" "}
            </span>
            {this.state.post.header.startDate}
          </h5>
          <h6>
            {" "}
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>
              To:{" "}
            </span>{" "}
            {this.state.post.header.endDate}
          </h6>

          <p className="addressline">{this.state.post.header.address}</p>
          <p className="bedbath">
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>Bed: </span>{" "}
            {this.state.post.header.bed} |{" "}
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>Bath: </span>
            {this.state.post.header.bed}
          </p>
          <hr></hr>
          <p className="des">"{this.state.post.deets.description}"</p>
          <hr></hr>
          <ul>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Kitchen:{" "}
              </span>
              {this.state.post.deets.kitchen}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>Gym: </span>
              {this.state.post.deets.gym}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Washer:{" "}
              </span>
              {this.state.post.deets.washer}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Dryer:{" "}
              </span>
              {this.state.post.deets.dryer}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                WiFi:{" "}
              </span>
              {this.state.post.deets.wifi}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Air Conditioning:{" "}
              </span>
              {this.state.post.deets.AC}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Parking:{" "}
              </span>
              {this.state.post.deets.parking}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
class ListingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false
    };
  }
  async componentDidMount() {
    const response = await fetch(`${API}api/listings`);
    const posts = await response.json();
    this.setState({ posts });
  }

  render() {
    return (
      <div id="all-listings" data-testid="all">
        {this.state.loading && <Loading />}
        <div className="headerimage" data-testid="image-test">
          <h2>All Listings</h2>
          <div className="filter2"></div>
        </div>
        {this.state.posts.map(post => {
          return (
            <div className="results" key={post.id}>
              <NavLink
                to={`/all-listings/${post.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div
                  className="card"
                  key={post.id}
                  style={{
                    backgroundImage: 'url("' + post.header.image + '")',
                    backgroundSize: "cover"
                  }}
                >
                  <div className="headerbar">
                    <h3>{post.title}</h3>
                    <p className="addressline">{post.header.address}</p>
                    <p className="bedbath">
                      Bed: {post.header.bed} | Bath: {post.header.bed}
                    </p>
                    <p className="hostname">
                      <span
                        style={{
                          fontWeight: "600",
                          fontSize: "10pt",
                          lineHeight: "0pt"
                        }}
                      >
                        Host: {post.header.host}
                      </span>
                      <span
                        style={{
                          color: "orange",
                          fontWeight: "600",
                          fontSize: "10pt",
                          float: "right"
                        }}
                      >
                        {post.header.likes} likes
                      </span>
                    </p>
                  </div>
                </div>
              </NavLink>
              <Switch>
                <Route
                  path="/all-listings/:id"
                  component={ListingDetails}
                ></Route>
              </Switch>
            </div>
          );
        })}
      </div>
    );
  }
}

class ListingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      loading: true
    };
  }
  async componentDidUpdate(previousProps) {
    if (this.props.match.params.id !== previousProps.match.params.id) {
      this.setState({ loading: true });
      const listingId = this.props.match.params.id;
      const posts = await fetchListing(listingId);
      this.setState({
        post: posts ? posts : [],
        loading: false
      });
    }
  }
  async componentDidMount() {
    const listingId = this.props.match.params.id;
    const posts = await fetchListing(listingId);

    this.setState({
      //to address undefined page
      post: posts ? posts : [],
      loading: false
    });
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <div className="details">
        <div
          className="fullimage"
          style={{
            margin: "25px",
            width: "500px",
            height: "350px",
            backgroundImage: 'url("' + this.state.post.header.image + '")',
            backgroundSize: "cover",
            float: "left",
            borderRadius: "10pt",
            boxShadow: "2px 2px 10px rgb(175, 175, 175)"
          }}
        ></div>
        <div className="content">
          <h3>{this.state.post.title}</h3>
          <h4>${this.state.post.header.price}/month</h4>
          <h5>
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>
              Available from:{" "}
            </span>
            {this.state.post.header.startDate}
          </h5>
          <h6>
            {" "}
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>
              To:{" "}
            </span>{" "}
            {this.state.post.header.endDate}
          </h6>

          <NavLink to={`/listings/edit/${this.state.post.id}`} id="editbutton">
            Edit Listing Details
          </NavLink>

          <p className="addressline">{this.state.post.header.address}</p>
          <p className="bedbath">
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>Bed: </span>{" "}
            {this.state.post.header.bed} |{" "}
            <span style={{ fontSize: "12pt", fontWeight: "600" }}>Bath: </span>
            {this.state.post.header.bed}
          </p>
          <hr></hr>
          <p className="des">"{this.state.post.deets.description}"</p>
          <hr></hr>
          <ul>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Kitchen:{" "}
              </span>
              {this.state.post.deets.kitchen}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>Gym: </span>
              {this.state.post.deets.gym}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Washer:{" "}
              </span>
              {this.state.post.deets.washer}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Dryer:{" "}
              </span>
              {this.state.post.deets.dryer}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                WiFi:{" "}
              </span>
              {this.state.post.deets.wifi}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Air Conditioning:{" "}
              </span>
              {this.state.post.deets.AC}
            </li>
            <li>
              <span style={{ fontSize: "12pt", fontWeight: "600" }}>
                Parking:{" "}
              </span>
              {this.state.post.deets.parking}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

class NewListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      mypost: true,
      title: "",
      image: "",
      bed: 0,
      bath: 0,
      city: "",
      address: "",
      price: 0,
      startDate: "2019-12-11",
      endDate: "2019-12-12",
      host: "",
      description: "",
      kitchen: "",
      gym: "",
      washer: "",
      dryer: "",
      wifi: "",
      AC: "",
      parking: ""
    };
  }

  handleMypost = () => {
    this.setState({ mypost: true });
  };
  handleTitleChange = event => {
    this.setState({ title: event.target.value });
  };
  handleImageChange = event => {
    this.setState({ image: event.target.value });
  };
  handleBedChange = event => {
    this.setState({ bed: event.target.value });
  };
  handleBathChange = event => {
    this.setState({ bath: event.target.value });
  };
  handleDesChange = event => {
    this.setState({ description: event.target.value });
  };
  handleCityChange = event => {
    this.setState({ city: event.target.value });
  };
  handleAddressChange = event => {
    this.setState({ address: event.target.value });
  };

  handlePriceChange = event => {
    this.setState({ price: event.target.value });
  };
  handleStartChange = event => {
    this.setState({ startDate: event.target.value });
  };
  handleEndChange = event => {
    this.setState({ endDate: event.target.value });
  };
  handleHostChange = event => {
    this.setState({ host: event.target.value });
  };
  handleKitchenChange = event => {
    this.setState({ kitchen: event.target.value });
  };
  handleGymChange = event => {
    this.setState({ gym: event.target.value });
  };
  handleWasherChange = event => {
    this.setState({ washer: event.target.value });
  };
  handleDryerChange = event => {
    this.setState({ dryer: event.target.value });
  };
  handleWifiChange = event => {
    this.setState({ wifi: event.target.value });
  };
  handleACChange = event => {
    this.setState({ AC: event.target.value });
  };
  handleParkingChange = event => {
    this.setState({ parking: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const errors = {};
    let hasErrors = false;

    if (this.state.title.length === 0) {
      errors.title = "The title field is required";
      hasErrors = true;
    }
    if (this.state.image.length === 0) {
      errors.image = "The image link is required";
      hasErrors = true;
    }
    if (this.state.address.length === 0) {
      errors.address = "The address is required";
      hasErrors = true;
    }
    if (this.state.city.length === 0) {
      errors.city = "The city is required";
      hasErrors = true;
    }
    if (this.state.price === 0) {
      errors.price = "The price cannot be 0";
      hasErrors = true;
    }
    if (this.state.host.length === 0) {
      errors.host = "Please write your full name";
      hasErrors = true;
    }
    if (this.state.description.length >= 100) {
      errors.description = "Under 100 characters";
      hasErrors = true;
    }
    if (this.state.kitchen.length === 0) {
      errors.kitchen = "Kitchen description required";
      hasErrors = true;
    }
    if (this.state.gym.length === 0) {
      errors.gym = "Gym description required";
      hasErrors = true;
    }
    if (this.state.washer.length === 0) {
      errors.washer = "Washer description required";
      hasErrors = true;
    }
    if (this.state.dryer.length === 0) {
      errors.dryer = "Dryer description required";
      hasErrors = true;
    }
    if (this.state.wifi.length === 0) {
      errors.wifi = "Wifi description required";
      hasErrors = true;
    }
    if (this.state.AC.length === 0) {
      errors.AC = "AC description required";
      hasErrors = true;
    }
    if (this.state.parking.length === 0) {
      errors.parking = "Parking description required";
      hasErrors = true;
    }
    this.setState({ errors });
    if (hasErrors) {
    } else {
      await fetch(`${API}api/listings`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          title: this.state.title,

          header: {
            mypost: this.state.mypost,
            image: this.state.image,
            bed: this.state.bed,
            bath: this.state.bath,
            city: this.state.city,
            address: this.state.address,
            price: this.state.price,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            likes: this.state.likes,
            host: this.state.host
          },
          deets: {
            description: this.state.description,
            kitchen: this.state.kitchen,
            gym: this.state.gym,
            washer: this.state.washer,
            dryer: this.state.dryer,
            wifi: this.state.wifi,
            AC: this.state.AC,
            parking: this.state.parking,
            map: this.state.map,
            rules: this.state.rules
          }
        })
      });
      this.setState({ redirectToMain: true });
      alert("You've successfully created your post");
    }
  };

  render() {
    if (this.state.redirectToMain) {
      return <Redirect to="/all-listings" />;
    }
    return (
      <form
        onSubmit={this.handleSubmit}
        className="postingform"
        data-testid="new-listing"
      >
        <div>
          <label htmlFor="mypost" className="mypost" data-testid="labels">
            My Post
          </label>
          <input
            type="radio"
            className="mypost"
            value={this.state.mypost}
            onChange={this.handleMypost}
            checked
            data-testid="input-field"
          ></input>
        </div>
        <div>
          <label htmlFor="title" data-testid="labels">
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="postingtext"
            value={this.state.title}
            onChange={this.handleTitleChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.title}
          </p>
        </div>
        <div>
          <label htmlFor="image" data-testid="labels">
            Image Link:
          </label>
          <input
            type="text"
            className="postingtext"
            id="image"
            value={this.state.image}
            onChange={this.handleImageChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.image}
          </p>
        </div>
        <div>
          <label htmlFor="bed" data-testid="labels">
            Number of Beds:
          </label>
          <input
            type="number"
            className="postingnumber"
            id="bed"
            min="0"
            max="10"
            value={this.state.bed}
            onChange={this.handleBedChange}
            data-testid="input-field"
          />
        </div>
        <div>
          <label htmlFor="bath" data-testid="labels">
            Number of Bath:
          </label>
          <input
            type="number"
            className="postingnumber"
            id="bath"
            min="0"
            max="10"
            value={this.state.bath}
            onChange={this.handleBathChange}
            data-testid="input-field"
          />
        </div>
        <div>
          <label htmlFor="address" data-testid="labels">
            Address:
          </label>
          <input
            type="text"
            className="postingtext"
            id="address"
            value={this.state.address}
            onChange={this.handleAddressChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.address}
          </p>
        </div>
        <div>
          <label htmlFor="city" data-testid="labels">
            City:
          </label>
          <input
            type="text"
            className="postingtext"
            id="city"
            value={this.state.city}
            onChange={this.handleCityChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.city}
          </p>
        </div>
        <div>
          <label htmlFor="price" data-testid="labels">
            Price:
          </label>
          <input
            type="number"
            className="postingnumber"
            id="price"
            value={this.state.price}
            onChange={this.handlePriceChange}
            data-testid="input-field"
          />
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.price}
          </p>
        </div>
        <div>
          <label htmlFor="startDate" data-testid="labels">
            Start date:
          </label>
          <input
            type="date"
            className="postingdate"
            id="startDate"
            min="2019-12-11"
            max="2020-12-31"
            value={this.state.startDate}
            onChange={this.handleStartChange}
            data-testid="input-field"
          />
        </div>
        <div>
          <label htmlFor="endDate" data-testid="labels">
            End date:
          </label>
          <input
            type="date"
            id="endDate"
            className="postingdate"
            min="2019-12-12"
            max="2020-12-31"
            value={this.state.endDate}
            onChange={this.handleEndChange}
            data-testid="input-field"
          />
        </div>
        <div>
          <label htmlFor="host" data-testid="labels">
            Host Name:
          </label>
          <input
            type="text"
            className="postingtext"
            id="host"
            value={this.state.host}
            onChange={this.handleHostChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.host}
          </p>
        </div>
        <div>
          <label htmlFor="description" data-testid="labels">
            Description:
          </label>
          <textarea
            className="postingtextarea"
            id="description"
            value={this.state.description}
            onChange={this.handleDesChange}
            data-testid="input-field"
          ></textarea>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.description}
          </p>
        </div>

        <div>
          <label htmlFor="kitchen" data-testid="labels">
            Kitchen:
          </label>
          <input
            type="text"
            className="postingtext"
            id="kitchen"
            value={this.state.kitchen}
            onChange={this.handleKitchenChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.kitchen}
          </p>
        </div>
        <div>
          <label htmlFor="gym" data-testid="labels">
            Gym:
          </label>
          <input
            type="text"
            className="postingtext"
            id="gym"
            value={this.state.gym}
            onChange={this.handleGymChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.gym}
          </p>
        </div>
        <div>
          <label htmlFor="washer" data-testid="labels">
            Washer:
          </label>
          <input
            type="text"
            className="postingtext"
            id="washer"
            value={this.state.washer}
            onChange={this.handleWasherChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.washer}
          </p>
        </div>
        <div>
          <label htmlFor="dryer" data-testid="labels">
            Dryer:
          </label>
          <input
            type="text"
            className="postingtext"
            id="dryer"
            value={this.state.dryer}
            onChange={this.handleDryerChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.dryer}
          </p>
        </div>
        <div>
          <label htmlFor="wifi" data-testid="labels">
            WiFi:
          </label>
          <input
            type="text"
            className="postingtext"
            id="wifi"
            value={this.state.wifi}
            onChange={this.handleWifiChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.wifi}
          </p>
        </div>
        <div>
          <label htmlFor="AC" data-testid="labels">
            Air Conditioner:
          </label>
          <input
            type="text"
            className="postingtext"
            id="AC"
            value={this.state.AC}
            onChange={this.handleACChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.AC}
          </p>
        </div>
        <div>
          <label htmlFor="parking" data-testid="labels">
            Parking:
          </label>
          <input
            type="text"
            className="postingtext"
            id="parking"
            value={this.state.parking}
            onChange={this.handleParkingChange}
            data-testid="input-field"
          ></input>
          <p className="errormsg" data-testid="error-msg">
            {this.state.errors.parking}
          </p>
        </div>

        <button id="publish">Publish</button>
      </form>
    );
  }
}
class EditListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      mypost: true,
      title: "",
      image: "",
      bed: 0,
      bath: 0,
      address: "",
      city: "",
      price: 0,
      startDate: "2019-12-11",
      endDate: "2019-12-12",
      host: "",
      description: "",
      kitchen: "",
      gym: "",
      washer: "",
      dryer: "",
      wifi: "",
      AC: "",
      parking: ""
    };
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    const response = await fetch(`${API}api/listings/${id}`);
    const json = await response.json();
    this.setState({
      mypost: json.header.mypost,
      title: json.title,
      image: json.header.image,
      bed: json.header.bed,
      bath: json.header.bath,
      address: json.header.address,
      city: json.header.city,
      price: json.header.price,
      startDate: json.header.startDate,
      endDate: json.header.endDate,
      host: json.header.host,
      description: json.deets.description,
      kitchen: json.deets.kitchen,
      gym: json.deets.gym,
      washer: json.deets.washer,
      dryer: json.deets.dryer,
      wifi: json.deets.wifi,
      AC: json.deets.AC,
      parking: json.deets.parking
    });
  }
  handleMypost = () => {
    this.setState({ mypost: true });
  };
  handleTitleChange = event => {
    this.setState({ title: event.target.value });
  };
  handleImageChange = event => {
    this.setState({ image: event.target.value });
  };
  handleBedChange = event => {
    this.setState({ bed: event.target.value });
  };
  handleBathChange = event => {
    this.setState({ bath: event.target.value });
  };
  handleDesChange = event => {
    this.setState({ description: event.target.value });
  };
  handleAddressChange = event => {
    this.setState({ address: event.target.value });
  };
  handleCityChange = event => {
    this.setState({ city: event.target.value });
  };
  handlePriceChange = event => {
    this.setState({ price: event.target.value });
  };
  handleStartChange = event => {
    this.setState({ startDate: event.target.value });
  };
  handleEndChange = event => {
    this.setState({ endDate: event.target.value });
  };
  handleHostChange = event => {
    this.setState({ host: event.target.value });
  };
  handleKitchenChange = event => {
    this.setState({ kitchen: event.target.value });
  };
  handleGymChange = event => {
    this.setState({ gym: event.target.value });
  };
  handleWasherChange = event => {
    this.setState({ washer: event.target.value });
  };
  handleDryerChange = event => {
    this.setState({ dryer: event.target.value });
  };
  handleWifiChange = event => {
    this.setState({ wifi: event.target.value });
  };
  handleACChange = event => {
    this.setState({ AC: event.target.value });
  };
  handleParkingChange = event => {
    this.setState({ parking: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const errors = {};
    let hasErrors = false;

    if (this.state.title.length === 0) {
      errors.title = "The title field is required";
      hasErrors = true;
    }
    if (this.state.image.length === 0) {
      errors.image = "The image link is required";
      hasErrors = true;
    }
    if (this.state.address.length === 0) {
      errors.address = "The address is required";
      hasErrors = true;
    }
    if (this.state.city.length === 0) {
      errors.city = "The city is required";
      hasErrors = true;
    }
    if (this.state.price === 0) {
      errors.price = "The price cannot be 0";
      hasErrors = true;
    }
    if (this.state.host.length === 0) {
      errors.host = "Please write your full name";
      hasErrors = true;
    }
    if (this.state.description.length >= 100) {
      errors.description = "Under 100 characters";
      hasErrors = true;
    }
    if (this.state.kitchen.length === 0) {
      errors.kitchen = "Kitchen description required";
      hasErrors = true;
    }
    if (this.state.gym.length === 0) {
      errors.gym = "Gym description required";
      hasErrors = true;
    }
    if (this.state.washer.length === 0) {
      errors.washer = "Washer description required";
      hasErrors = true;
    }
    if (this.state.dryer.length === 0) {
      errors.dryer = "Dryer description required";
      hasErrors = true;
    }
    if (this.state.wifi.length === 0) {
      errors.wifi = "Wifi description required";
      hasErrors = true;
    }
    if (this.state.AC.length === 0) {
      errors.AC = "AC description required";
      hasErrors = true;
    }
    if (this.state.parking.length === 0) {
      errors.parking = "Parking description required";
      hasErrors = true;
    }
    this.setState({ errors });
    if (hasErrors) {
    } else {
      const { id } = this.props.match.params;
      await fetch(`${API}api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          title: this.state.title,

          header: {
            mypost: this.state.mypost,
            image: this.state.image,
            bed: this.state.bed,
            bath: this.state.bath,
            city: this.state.city,
            address: this.state.address,
            price: this.state.price,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            likes: this.state.likes,
            host: this.state.host
          },
          deets: {
            description: this.state.description,
            kitchen: this.state.kitchen,
            gym: this.state.gym,
            washer: this.state.washer,
            dryer: this.state.dryer,
            wifi: this.state.wifi,
            AC: this.state.AC,
            parking: this.state.parking,
            map: this.state.map,
            rules: this.state.rules
          }
        })
      });
      this.setState({ redirectToMain: true });
      alert("You've successfully edited your post");
    }
  };

  render() {
    if (this.state.redirectToMain) {
      return <Redirect to="/my" />;
    }
    return (
      <div className="edit">
        <h5>Edit Post</h5>
        <form onSubmit={this.handleSubmit} className="postingform">
          <div>
            <label htmlFor="mypost" className="mypost">
              My Post
            </label>
            <input
              type="radio"
              className="mypost"
              value={this.state.mypost}
              onChange={this.handleMypost}
              checked
            ></input>
          </div>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              className="postingtext"
              value={this.state.title}
              onChange={this.handleTitleChange}
            ></input>
            <p className="errormsg">{this.state.errors.title}</p>
          </div>
          <div>
            <label htmlFor="image">Image Link:</label>
            <input
              type="text"
              className="postingtext"
              id="image"
              value={this.state.image}
              onChange={this.handleImageChange}
            ></input>
            <p className="errormsg">{this.state.errors.image}</p>
          </div>
          <div>
            <label htmlFor="bed">Number of Beds:</label>
            <input
              type="number"
              className="postingnumber"
              id="bed"
              min="0"
              max="10"
              value={this.state.bed}
              onChange={this.handleBedChange}
            />
          </div>
          <div>
            <label htmlFor="bath">Number of Bath:</label>
            <input
              type="number"
              className="postingnumber"
              id="bath"
              min="0"
              max="10"
              value={this.state.bath}
              onChange={this.handleBathChange}
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              className="postingtext"
              id="address"
              value={this.state.address}
              onChange={this.handleAddressChange}
            ></input>
            <p className="errormsg">{this.state.errors.address}</p>
          </div>
          <div>
            <label htmlFor="city">City:</label>
            <input
              type="text"
              className="postingtext"
              id="city"
              value={this.state.city}
              onChange={this.handleCityChange}
            ></input>
            <p className="errormsg">{this.state.errors.city}</p>
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              className="postingnumber"
              id="price"
              value={this.state.price}
              onChange={this.handlePriceChange}
            />
            <p className="errormsg">{this.state.errors.price}</p>
          </div>
          <div>
            <label htmlFor="startDate">Start date:</label>
            <input
              type="date"
              className="postingdate"
              id="startDate"
              min="2019-12-11"
              max="2020-12-31"
              value={this.state.startDate}
              onChange={this.handleStartChange}
            />
          </div>
          <div>
            <label htmlFor="endDate">End date:</label>
            <input
              type="date"
              id="endDate"
              className="postingdate"
              min="2019-12-12"
              max="2020-12-31"
              value={this.state.endDate}
              onChange={this.handleEndChange}
            />
          </div>
          <div>
            <label htmlFor="host">Host Name:</label>
            <input
              type="text"
              className="postingtext"
              id="host"
              value={this.state.host}
              onChange={this.handleHostChange}
            ></input>
            <p className="errormsg">{this.state.errors.host}</p>
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              className="postingtextarea"
              id="description"
              value={this.state.description}
              onChange={this.handleDesChange}
            ></textarea>
            <p className="errormsg">{this.state.errors.description}</p>
          </div>

          <div>
            <label htmlFor="kitchen">Kitchen:</label>
            <input
              type="text"
              className="postingtext"
              id="kitchen"
              value={this.state.kitchen}
              onChange={this.handleKitchenChange}
            ></input>
            <p className="errormsg">{this.state.errors.kitchen}</p>
          </div>
          <div>
            <label htmlFor="gym">Gym:</label>
            <input
              type="text"
              className="postingtext"
              id="gym"
              value={this.state.gym}
              onChange={this.handleGymChange}
            ></input>
            <p className="errormsg">{this.state.errors.gym}</p>
          </div>
          <div>
            <label htmlFor="washer">Washer:</label>
            <input
              type="text"
              className="postingtext"
              id="washer"
              value={this.state.washer}
              onChange={this.handleWasherChange}
            ></input>
            <p className="errormsg">{this.state.errors.washer}</p>
          </div>
          <div>
            <label htmlFor="dryer">Dryer:</label>
            <input
              type="text"
              className="postingtext"
              id="dryer"
              value={this.state.dryer}
              onChange={this.handleDryerChange}
            ></input>
            <p className="errormsg">{this.state.errors.dryer}</p>
          </div>
          <div>
            <label htmlFor="wifi">WiFi:</label>
            <input
              type="text"
              className="postingtext"
              id="wifi"
              value={this.state.wifi}
              onChange={this.handleWifiChange}
            ></input>
            <p className="errormsg">{this.state.errors.wifi}</p>
          </div>
          <div>
            <label htmlFor="AC">Air Conditioner:</label>
            <input
              type="text"
              className="postingtext"
              id="AC"
              value={this.state.AC}
              onChange={this.handleACChange}
            ></input>
            <p className="errormsg">{this.state.errors.AC}</p>
          </div>
          <div>
            <label htmlFor="parking">Parking:</label>
            <input
              type="text"
              className="postingtext"
              id="parking"
              value={this.state.parking}
              onChange={this.handleParkingChange}
            ></input>
            <p className="errormsg">{this.state.errors.parking}</p>
          </div>

          <button id="publish">Publish</button>
        </form>
      </div>
    );
  }
}
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false
    };
  }
  async componentDidMount() {
    const response = await fetch(`${API}api/listings`);
    const posts = await response.json();
    this.setState({ posts });
  }
  deleteListing = async id => {
    await fetch(`${API}api/listings/${id}`, {
      method: "DELETE"
    });
    alert("You've successfully deleted your post");
    this.setState({
      posts: this.state.posts.filter(post => {
        return post.id !== id;
      })
    });
  };
  render() {
    return (
      <div id="all-listings">
        {this.state.loading && <Loading />}
        <div className="headerblank">
          <h2>My Listings</h2>
        </div>
        {this.state.posts.map(post => {
          if (post.header.mypost === true) {
            return (
              <div className="results" key={post.id}>
                <NavLink
                  to={`/my/${post.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div
                    className="card"
                    key={post.id}
                    style={{
                      backgroundImage: 'url("' + post.header.image + '")',
                      backgroundSize: "cover"
                    }}
                  >
                    <button
                      onClick={this.deleteListing.bind(this, post.id)}
                      id="delete"
                    >
                      Delete
                    </button>

                    <div className="headerbar">
                      <h3>{post.title}</h3>
                      <p className="addressline">{post.header.address}</p>
                      <p className="bedbath">
                        Bed: {post.header.bed} | Bath: {post.header.bed}
                      </p>
                      <p className="hostname">
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "10pt",
                            lineHeight: "0pt"
                          }}
                        >
                          Host: {post.header.host}
                        </span>
                        <span
                          style={{
                            color: "orange",
                            fontWeight: "600",
                            fontSize: "10pt",
                            float: "right"
                          }}
                        >
                          {post.header.likes} likes
                        </span>
                      </p>
                    </div>
                  </div>
                </NavLink>
                <Switch>
                  <Route path="/my/:id" component={ListingDetails}></Route>
                </Switch>
              </div>
            );
          }
        })}
      </div>
    );
  }
}
export default App;
export {
  App,
  HomePage,
  Loading,
  SearchForm,
  IndividualListing,
  ListingsPage,
  ListingDetails,
  NewListing,
  EditListing,
  Profile
};
