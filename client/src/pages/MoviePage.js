import { useEffect, useState } from 'react';
import { Box, Card, Container, TextField } from '@mui/material';
import { NavLink } from 'react-router-dom';
import movies from '../data/movies';
import MovieCards from '../components/MovieCards'
const config = require('../config.json');

export default function MoviePage() {
  const [searchString, setSearchString] = useState("");

  const [watchedMovies, setWatchedMovies] = useState([]);
  const [searchResultMovies, setSearchResultMovies] = useState([]);
  const [recMovies, setRecMovies] = useState([]);

  const username = 'user1'

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movie/watched/${username}`)
      .then(res => res.json())
      .then(resJson => {
          console.log(resJson)
          setWatchedMovies(resJson);
      });
  },[])

  useEffect(() => {
    const page = 1
    fetch(`http://${config.server_host}:${config.server_port}/movie/recommendation?page=${page}&page_size=10`)
      .then(res => res.json())
      .then(resJson => {
          console.log(resJson)
          setRecMovies(resJson);
      });
  },[])

  const handleSearch = () => {
    fetch(`http://${config.server_host}:${config.server_port}/movie/search/?title=${searchString}`)
      .then(res => res.json())
      .then(resJson => {
          console.log(resJson)
          setSearchResultMovies(resJson);
      });
  }

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
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
  );
}