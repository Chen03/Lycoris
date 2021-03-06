import React from "react";
import './SearchItem.css';
import defImg from './default.svg'
import Agent from "../../Tools/Agent";
import { PlayListContext } from "../../Tools/PlayList";

//TODO Add 'add to end && add to top'
class SearchItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgSrc: defImg
    };
  }

  componentDidMount() {
    this.getPicPromise = Agent.getSong(this.props.data.id)
      .then(v => v.al.picUrl && this.setState({ imgSrc: v.al.picUrl }));
      // .then(v => v && this.setState({src: v}));
  }

  static contextType = PlayListContext;

  addSong = () => {
    // console.log(this.context);
    let url = '';
    // let p = Agent.getSongUrl(this.props.data.id)
    //   .then(v => url = v);
    Promise.all([this.getPicPromise])
      .then(() => this.context.songController.addSong({
        name: this.props.data.name,
        platform: this.props.data.platform,
        id: this.props.data.id,
        artists: this.props.data.artists,
        picUrl: this.state.imgSrc
      }, false));
  }


  render() {
    return (
      <div className="searchItem" onClick={ this.addSong }>
        <img className="searchItemImage" src={this.state.imgSrc} />
        <div className="searchItemTitleWrapper">
          <div className="searchItemTitle">{this.props.data.name}</div>
          <div className="searchItemDetail">{`${this.props.data.type} · ${this.props.data.artists[0].name}`}</div>
        </div>
      </div>
    );
  }
}

class SearchItemWrapper extends React.Component {
  constructor(props) {
    super(props);

    Agent.searchSuggest('夜明けの詩')
      .then(v => Agent.parseSearchResult(v))
      .then(v => this.setState({data: v[0]}));

    this.state = {
      data: null
    };
  }

  render() {
    return (
      this.state.data && 
      <SearchItem data={this.state.data} />
    )
  }
}

export default SearchItem;