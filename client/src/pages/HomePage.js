import { useEffect, useState } from 'react';
import { Container, Divider, Link, TextField } from '@mui/material';
import { json, NavLink } from 'react-router-dom';
import anime_genres from '../data/anime_genres';

import AnimeGenre from './AnimeGenre';
import AnimeCards from '../components/AnimeCards';
const config = require('../config.json');

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchResultAnimes, setSearchResultAnimes] = useState([]);

  useEffect(() => {
    setGenres(['Action']);
  }, []);

  const handleSearch = () => {
    fetch(`http://${config.server_host}:${config.server_port}/anime/search/?anime=${searchString}`)
      .then(res => res.json())
      .then(resJson => {
          console.log(resJson)
          setSearchResultAnimes(resJson);
      });
  }

  // anime recommendation by genre route

  return (
    <Container>
      <div className="mt-4 mb-3" >
        <TextField label='search anime' value={searchString} onChange={(e) => setSearchString(e.target.value)} style={{ width: "90%" }}/>
        <div onClick={handleSearch} className='btn mt-2'>Search!</div>
      </div>

      {searchResultAnimes.length !== 0 && 
      <div className='m-3'>
        <h4>Search results</h4>
        <AnimeCards animes={searchResultAnimes}/>
      </div>}

      <h2 className='mb-3'> Recommended animes by genre: </h2>
      
      {genres.map((genre) => 
        <AnimeGenre genre={genre}/>
      )}

      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]}/> */}

    </Container>
  );
};