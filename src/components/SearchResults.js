import React, { Component } from 'react'
import { Pagination, Card , Spin} from "antd";
import axios from "axios"
import nextId from "react-id-generator";
import { Button } from 'antd';
import { LeftOutlined , SearchOutlined} from '@ant-design/icons'

import "../App.scss"

const { Meta } = Card;
const pageSize = 8;


function RelatedSearch(props) {
  const search = props.data;
  const listItems = search.map((search) =>
    <div className="search-badge" key={nextId()} onClick={() => props.onChangeSearch(search)}>
      <SearchOutlined /> {search}
    </div>
  );
  return (listItems)
}

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      keywords: [],
      loading: false,
      totalPage: 0,
      current: 1,
      minIndex: 0,
      maxIndex: 0
    }
    this.relatedSearchOnChange = this.relatedSearchOnChange.bind(this); 
  }

  transformation(data){
    let relatedKey = []
    const result = data.map(el => {
      if(el.data && el.data[0].keywords){
        el.data[0].keywords.forEach(element => {
           if(relatedKey.indexOf(element) === -1){
            relatedKey.push(element)
           }
        });
      }
      let object = {
        'id': nextId(),
        'thumbnail': el.links ? el.links[0].href: null,
        'title' : el.data ? el.data[0].title: null,
        'keywords': el.data ? el.data[0].keywords: null,
        'date_created': el.data ? el.data[0].date_created: null

      }
      return object;
    })
    this.setState({keywords: relatedKey})
    return result;
  }

  componentDidMount() {
    this.getSearchResults()
  }

  relatedSearchOnChange(search){
     this.getSearchResults()
     this.props.onChangeSearch(search) 
  }

  getSearchResults(){
    this.setState({loading: true, current: 1, minIndex: 0, maxIndex:0})
    const {searchQuery} = this.props;
    axios.get(`https://images-api.nasa.gov/search?q=${searchQuery}`)
    .then(res => {
        let response = this.transformation(res.data.collection.items);
        this.setState({
          data: response,
          totalPage: response.length / pageSize,
          minIndex: 0,
          maxIndex: pageSize
        })
      })
    .finally(() => {
      this.setState({loading: false})
    })
    .catch(error => {
      console.log(error)
    })
  }

  handleChange = (page) => {
    this.setState({
      current: page,
      minIndex: (page - 1) * pageSize,
      maxIndex: page * pageSize
    });
    
  };

  render() {
    const { data, current, minIndex, maxIndex, loading , keywords} = this.state;

    return (
      <div className="search-main-container" style={{ marginTop: "20px" }}>
       { !loading ?
        <>
          <Button className="back-btn" onClick={this.props.manageSearch}><LeftOutlined />Back</Button>
          <h1>Search Results for {this.props.searchQuery}</h1>
          <div className="search-container">
            {data?.map(
              (data, index) =>
                index >= minIndex &&
                index < maxIndex && (
                  <Card
                    hoverable
                    key={data.id}
                    className="search-card"
                    style={{ width: 300, height: 300 }}
                    cover={<img className="search-image" src={data.thumbnail || process.env.PUBLIC_URL + '/default.png'} alt={data.title} />}
                  >
                    <Meta title={data.title} description= {new Date(data.date_created).toDateString()} />
                  </Card>   
                )
            )}
          </div>
          <div className="pagination-container">
            <Pagination
              showSizeChanger={false}
              pageSize={pageSize}
              current={current}
              total={data.length}
              onChange={this.handleChange}
              style={{ bottom: "0px" }}
            />
          </div>
          <div className='related-search'>
            <h5>Related Searches</h5>
            {keywords.length > 0 ? <RelatedSearch onChangeSearch={this.relatedSearchOnChange} data={keywords} />: "No related results to Show"}  
          </div>
        </>: <div className="spinner"><Spin /></div>}
      </div>
    );
  }
}
