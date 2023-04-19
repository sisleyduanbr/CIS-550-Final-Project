import { useEffect, useState } from 'react';
import { Container, Divider, Link, TextField } from '@mui/material';
import { json, NavLink } from 'react-router-dom';
import anime_genres from '../data/anime_genres';

import AnimeGenre from './AnimeGenre';
const config = require('../config.json');

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    setGenres(anime_genres);
  });

  return (
    <Container>
      <TextField className="mt-4 mb-3" label='search an anime' value={searchString} onChange={(e) => setSearchString(e.target.value)} style={{ width: "100%" }}/>
      <h2 className='mb-3'> Recommended animes by genre: </h2>
      
      {genres.map((genre) => 
        <AnimeGenre genre={genre}/>
      )}

      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]}/> */}

    </Container>
  );
};