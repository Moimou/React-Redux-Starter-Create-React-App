import React, { Component } from "react";
import SearchBar from "../components/search-bar";
import VideoList from "./video-list";
import VideoDetail from "../components/video-detail";
import Video from "../components/video";
import axios from "axios";

const API_END_POINT = "https://api.themoviedb.org/3/";
const API_KEY = "aa46ab392e34f73456485af45a0c5523";
const DEFAULT_TYPE_SEARCH = "discover";
const DEFAULT_PARAM = "language=fr&include_adult=false";
const POPULAR_MOVIES_URL =
  "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images";
const MOVIE_VIDEO_URL = "append_to_response=videos&include_adult=false";
const SEARCH_URL = "search/movie?language=fr&include_adult=false";
//${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${searchText}
//${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { movieList: {}, currentMovie: {} };
  }
  componentWillMount() {
    this.initMovies();
  }

  initMovies() {
    axios
      .get(
        `${API_END_POINT}${DEFAULT_TYPE_SEARCH}/movie?api_key=${API_KEY}&sort_by=popularity.desc&${DEFAULT_PARAM}`
      )
      .then(
        function (response) {
          this.setState(
            {
              movieList: response.data.results.slice(1, 6),
              currentMovie: response.data.results[0],
            },
            function () {
              this.applyVideoToCurrentMovie();
            }
          );
          //this.setState({ currentMovie: response.data.results[0] });
          //console.log("", this.state.movieList);
        }.bind(this)
      );
  }
  //------------------------------------------------------------------------------
  setRecommendation() {
    axios
      .get(
        `${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?api_key=${API_KEY}&language=fr`
      )
      .then(
        function (response) {
          this.setState({
            movieList: response.data.results.slice(0, 5),
          });
        }.bind(this)
      );
  }
  //------------------------------------------------------------------------------
  applyVideoToCurrentMovie() {
    axios
      .get(
        `${API_END_POINT}movie/${this.state.currentMovie.id}?api_key=${API_KEY}&append_to_response=videos&include_adult=false`
      )
      .then(
        function (response) {
          console.log(response);
          const youtubeKey = response.data.videos.results[0].key;
          let newCurrentMovieState = this.state.currentMovie;
          newCurrentMovieState.videoId = youtubeKey;
          this.setState({ currentMovie: newCurrentMovieState });
        }.bind(this)
      );
  }

  onClickListItem(movie) {
    this.setState({ currentMovie: movie }, function () {
      this.applyVideoToCurrentMovie();
      this.setRecommendation();
    });
  }
  onClickSearch(searchText) {
    //console.log(searchText);
    if (searchText) {
      axios
        .get(
          `${API_END_POINT}${SEARCH_URL}&api_key=${API_KEY}&query=${searchText}`
        )
        .then(
          function (response) {
            if (response.data && response.data.results[0]) {
              if (response.data.results[0].id && this.state.currentMovie.id) {
                this.setState(
                  {
                    currentMovie: response.data.results[0],
                  },
                  function () {
                    this.applyVideoToCurrentMovie();
                    this.setRecommendation();
                  }
                );
              }
            }
          }.bind(this)
        );
    }
  }
  render() {
    const renderVideoList = () => {
      if (this.state.movieList.length >= 5) {
        return (
          <VideoList
            movieList={this.state.movieList}
            callBack={this.onClickListItem.bind(this)}
          />
        );
      }
    };
    return (
      <div>
        <div className="search_bar">
          <SearchBar callBack={this.onClickSearch.bind(this)} />
        </div>
        <div className="row">
          <div className="col-md-8">
            <Video videoId={this.state.currentMovie.videoId} />
            <VideoDetail
              title={this.state.currentMovie.title}
              description={this.state.currentMovie.overview}
            />
          </div>
          <div className="col-md-4">{renderVideoList()}</div>
        </div>
      </div>
    );
  }
}

export default App;
