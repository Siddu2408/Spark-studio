import React, { Component } from 'react';
import { Input, Spin } from 'antd';
import axios from 'axios';

import "../App.scss"
import SearchResults from './SearchResults';

const { REACT_APP_API_KEY } = process.env;
const { Search } = Input;

export default class componentName extends Component {

  constructor(props) {
    super(props);
    this.state={
      loading: false,
      pictureData: {},
      searchQuery: null,
      isSearchEnabled: false
    }
    this.manageSearch = this.manageSearch.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this); 
  }

  componentDidMount(){
    this.setState({loading: true})
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${REACT_APP_API_KEY}`)
    .then(res => {
       this.setState(state => ({
         ...state,
         pictureData: res.data,
         loading: false
       }))
    })
    .catch(error => {
      this.setState({loading: false})
        console.log(error)
    })
  }

   handleSearchInputChanges = (e) => {
    this.setState({searchQuery: e.target.value});
  }

  onChangeSearch(search){
    this.setState({searchQuery: search})
  }

  manageSearch(){
    this.setState({isSearchEnabled: false, searchQuery: null})
  }

   searchHandler = () => {
    const {isSearchEnabled} = this.state; 
    this.setState({isSearchEnabled: !isSearchEnabled })
  }

  render() {
    const {pictureData, loading, isSearchEnabled, searchQuery}= this.state;
    return (
      <>
      {!loading ? 
       <>
        { !isSearchEnabled ? (
           <div>
            <div className="search-container">
              <div className="title">
                {pictureData.title}
              </div>
              <div>
                <Search placeholder="input search text" 
                onChange={this.handleSearchInputChanges} onSearch={this.searchHandler} 
                enterButton="search" size="large" loading={loading} />
              </div>
              </div>
            <div className="img-container">
              <img
                alt={pictureData.title}
                src={pictureData.hdurl} 
                />
            </div>
            <p className="description">
              {pictureData.explanation}
            </p>
            <p className="date-content">Date: {pictureData.date}</p>
          </div>) : (<SearchResults searchQuery={searchQuery} manageSearch= {this.manageSearch} onChangeSearch={this.onChangeSearch} />)}
         </> :  <div className="spinner"><Spin /></div> }
       </>
    );
  }
}
