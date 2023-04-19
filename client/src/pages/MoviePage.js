import { useEffect, useState } from 'react';
import { Box, Card, Container, TextField } from '@mui/material';
import { NavLink } from 'react-router-dom';
import movies from '../data/movies';
import TempCards from '../components/TempCard';

const config = require('../config.json');

export default function MoviePage() {
  const [searchString, setSearchString] = useState("");

  const [watchedMovies, setWatchedMovies] = useState([]);
  const [searchResultMovies, setSearchResultMovies] = useState([]);
  const [recMovies, setRecMovies] = useState([]);

  useState(() => {
    setWatchedMovies(movies);
  })

  useState(() => {
    setSearchResultMovies(movies);
  })

  useState(() => {
    setRecMovies(movies);
  })

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container>
      <TextField className="mt-4 mb-3" label='search a movie' value={searchString} onChange={(e) => setSearchString(e.target.value)} style={{ width: "100%" }}/>

      <h4>Watched movies</h4>
      <TempCards objs={watchedMovies}/>

      <h4>Recommended movies</h4>
      <TempCards objs={recMovies}/>

      <h4>Search results</h4>
      <TempCards objs={recMovies}/>
    </Container>
  );
}