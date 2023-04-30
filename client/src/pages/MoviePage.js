import { useContext, useEffect, useState } from 'react';
import { Box, Card, Container, TextField } from '@mui/material';
import { NavLink } from 'react-router-dom';
import movies from '../data/movies';
import MovieCards from '../components/MovieCards'
import background from "../images/image5.jpeg";
import { LoginContext } from "../contexts/LoginContext";

const config = require('../config.json');

export default function MoviePage() {
  const [searchString, setSearchString] = useState("");
  const {username} = useContext(LoginContext);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [searchResultMovies, setSearchResultMovies] = useState([]);
  const [recMovies, setRecMovies] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movie/watched/${username}`)
      .then(res => res.json())
      .then(resJson => {
          setWatchedMovies(resJson);
      });
  },[])

  useEffect(() => {
    const page = 1
    fetch(`http://${config.server_host}:${config.server_port}/movie/${username}/recommendation?page=${page}&page_size=10`)
      .then(res => res.json())
      .then(resJson => {
          setRecMovies(resJson);
      });
  },[])

  const handleSearch = () => {
    fetch(`http://${config.server_host}:${config.server_port}/movie/search/?title=${searchString}`)
      .then(res => res.json())
      .then(resJson => {
          setSearchResultMovies(resJson);
      });
  }

  return (

    // replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <div style={{
      backgroundImage: `url(${background})`
    }}>

    <Container>
      <div className="mt-4 mb-3" >
        <TextField label='search for a movie you watched' value={searchString} onChange={(e) => setSearchString(e.target.value)} style={{ width: "90%" }}/>
        <div onClick={handleSearch} className='btn mt-2'>Search!</div>
      </div>

      {searchResultMovies.length !== 0 && 
      <div className='m-3'>
        <h4>Search results</h4>
        <MovieCards movies={searchResultMovies}/>
      </div>}

      <div className='m-3'>
        <h4>Watched movies</h4>
        <MovieCards movies={watchedMovies}/>
      </div>

      <div className='m-3'>
        <h4>You may have watched </h4>
        <MovieCards movies={recMovies}/>
      </div>
      
    </Container>
    </div>
  );
}