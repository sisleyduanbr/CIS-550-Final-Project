import AnimeGenre from "./AnimeGenre";
import anime_genres from "../data/anime_genres";
import { useContext, useEffect, useState } from "react";
import { Container, Divider } from "@mui/material";
import AnimeCards from "../components/AnimeCards";
import { LoginContext } from "../contexts/LoginContext";
import background from "../images/image8.jpeg";
const config = require('../config.json');

export default function AnimeRankingsPage() {
    const [genres, setGenres] = useState([]);
    const [topAnimes, setTopAnimes] = useState([]);
    const {username} = useContext(LoginContext);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/anime/genre_rec/${username}`)
          .then(res => res.json())
          .then(resJson => {
            const mappedGenres = resJson.map((g) => g.genre)
            setGenres(mappedGenres);
          });
      }, [])

    useEffect(() => {
        const page = 1
        fetch(`http://${config.server_host}:${config.server_port}/anime?page=${page}&page_size=4`)
        .then(res => res.json())
        .then(resJson => {
            setTopAnimes(resJson);
        });
    }, [])          



    return (
        <div style={{
            backgroundImage: `url(${background})`
        }}>
        <Container>
            <div className="m-3">
                <h2>Top Animes</h2>
                <AnimeCards animes={topAnimes}/>
            </div>
            {genres.map((genre) => 
                <AnimeGenre genre={genre} top={true}/>
            )}
        </Container>
        </div>
    )
}