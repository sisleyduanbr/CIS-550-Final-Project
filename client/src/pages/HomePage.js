import { useContext, useEffect, useState } from 'react';
import { Container, Divider, Link, TextField } from '@mui/material';
import { json, NavLink, useNavigate  } from 'react-router-dom';
import anime_genres from '../data/anime_genres';
import { LoginContext } from '../contexts/LoginContext';

import AnimeGenre from './AnimeGenre';
import AnimeCards from '../components/AnimeCards';
const config = require('../config.json');

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchResultAnimes, setSearchResultAnimes] = useState([]);
  const [animeRec, setAnimeRec] = useState([]);
  const {username} = useContext(LoginContext);

  // useEffect(() => {
  //   setGenres(['Action']);
  // }, []);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/anime/genre_rec/${username}`)
      .then(res => res.json())
      .then(resJson => {
        const mappedGenres = resJson.map((g) => g.genre)
        setGenres(mappedGenres);
      });
  }, [])

  const handleSearch = () => {
    fetch(`http://${config.server_host}:${config.server_port}/anime/search/?anime=${searchString}`)
      .then(res => res.json())
      .then(resJson => {
          setSearchResultAnimes(resJson);
      });
  }

  // anime recommendation by genre route
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/anime/rec/${username}`)
      .then(res => res.json())
      .then(resJson => {
          console.log("rec animes", resJson)
          setAnimeRec(resJson);
      });
  }, [username])

  return (
    <Container>
      {/* <h2>Recommended animes </h2> */}
      <div className="mt-4 mb-3 m-3" >
        <TextField label='search to add anime to your interest list' value={searchString} onChange={(e) => setSearchString(e.target.value)} style={{ width: "90%" }}/>
        <div onClick={handleSearch} className='btn mt-2'>Search!</div>
      </div>

      {searchResultAnimes.length !== 0 && 
      <div className='m-3'>
        <h4>Search results</h4>
        <AnimeCards animes={searchResultAnimes}/>
      </div>}
      
      <div className='m-3'>
        <h2 className="mb-3">Recommended For You</h2>
        <AnimeCards animes={animeRec}/>
      </div>
      
      {genres.map((genre) => 
        <AnimeGenre genre={genre} top={false}/>
      )}

    </Container>
  );
};