import { Container } from "@mui/system";
import { useState, useEffect } from "react";
import animes from "../data/anime";
import AnimeCards from '../components/AnimeCards'
const config = require('../config.json');

export default function AnimeWatchlistPage() {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    // animes on watch list

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