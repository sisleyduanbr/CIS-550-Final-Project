import { Container } from "@mui/system";
import { useState, useEffect } from "react";
import animes from "../data/anime";
import {LoginContext} from "../contexts/LoginContext";
import React, {useContext} from 'react'
import AnimeCards from '../components/AnimeCards'
const config = require('../config.json');

export default function AnimeWatchlistPage() {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    const {username} = useContext(LoginContext);
    const {password} = useContext(LoginContext);
    const {age} = useContext(LoginContext);
    const {gender} = useContext(LoginContext);
    const {occupation} = useContext(LoginContext);

    useEffect(() => {
        const username = 'user1'
        fetch(`http://${config.server_host}:${config.server_port}/anime/watched?username=${username}`)
          .then(res => res.json())
          .then(resJson => {
              console.log(resJson)
              setAnimesInWatchlist(resJson);
          });
      },[])

    return (
        <Container>
            <h2>Anime Watch List</h2>
            <AnimeCards animes={animesInWatchlist}/>
        </Container>

    )
}