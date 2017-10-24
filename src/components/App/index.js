import React, {Component} from "react";
import "./index.css";
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from "../../constants/index.js";
import Button from "../Button";
import Search from "../Search";
import Table from "../Table";

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      result: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  setSearchTopStories(result){
    const {hits, page} = result;
    const{searchKey, results} = this.state;

    // const oldHits = page !== 0
    //   ? this.state.result.hits
    //   : [];

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({results: {
      ...results,
      [searchKey]: {hits: updatedHits, page}
    }
    })
  }

  fetchSearchTopStories(searchTerm, page = 0){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({error: e}));
  }

  //part of the API
  componentDidMount(){
    const {searchTerm} = this.state;
    this.setState({seachKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id){
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    const updatedHits = hits.filter(item => item.objectID !== id);
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  render(){
    const {searchTerm, results, searchKey, error} = this.state;
    // const page = (result && result.page) || 0;
    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    if(error){
      return <p>Something went wrong</p>
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search Here</Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
           </div>
        ) : <Table list={list} onDismiss={this.onDismiss} />
        }
        <div className="interaction">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
        </div>
      </div>
    );
  }
}

export default App;
