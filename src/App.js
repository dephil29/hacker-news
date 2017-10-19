import React, {Component} from "react";
import "./App.css";

const DEFAULT_QUERY = 'redux';
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";


class Button extends Component {
  render(){
    const {onClick, className="", children} = this.props;
    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >{children}</button>
    )
  }
}

//es5 long form
// function Search(props) {
//
//     const {value, onChange, children} = props;
//     return (
//       <form>
//         {children}
//         <input
//         type="text"
//         onChange={onChange}
//         value={value}
//         />
//       </form>
//     )
//
// }

const Search = ({value, onChange, children}) => (
  <form>
    {children}
    <input
    type="text"
    onChange={onChange}
    value={value}
    />
  </form>
);

const largeColumn = {
  width: "30%",
  overflow: "hidden"
};

const midColumn = {
  width: "30%",
  paddingLeft: "15px"
};

const smallColumn = {
  width: "10%"
};

function Table(props) {
    const {list, pattern, onDismiss} = props;
    return(
      <div className="table">
      {list.filter(isSearched(pattern)).map(item => (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >X</Button>
            </span>
          </div>
        ))}
      </div>
    )
}

const isSearched = searchTerm => item => item.title.toLowerCase().includes(
  searchTerm.toLowerCase());

// function isSearched(searchTerm){
//   return function(item){
//     // some condition that return true or false
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  //part of the API
  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm)
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
    // console.log(this.state.searchTerm);
  }

  onDismiss(id){
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({
      result: Object.assign({}, this.state.result, {hits: updatedHits})
    });       //Object.assign is for deep merge to be able to delete one of the objects
  }
  //es6 version of result is as follows = result: {...this.state.result, hits: updatedHits}
  //the short version of code above
  // this.state = {
  //   list
  // }

  render(){
    const {searchTerm, result} = this.state;

    if(!result){
      return null;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            >Search Here</Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
