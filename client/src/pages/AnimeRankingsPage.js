import AnimeGenre from "./AnimeGenre";
import anime_genres from "../data/anime_genres";
import { useEffect, useState } from "react";
import { Container, Divider } from "@mui/material";
import AnimeCards from "../components/AnimeCards";
const config = require('../config.json');

export default function AnimeRankingsPage() {
    const [genres, setGenres] = useState([]);
    const [topAnimes, setTopAnimes] = useState([]);

    useEffect(() => {
        setGenres(['Romance']);
    }, []);
    
    // get genre of the user
    // top animes by genre

    useEffect(() => {
        const page = 1
        fetch(`http://${config.server_host}:${config.server_port}/anime?page=${page}&page_size=4`)
        .then(res => res.json())
        .then(resJson => {
            setTopAnimes(resJson);
        });
    }, [])          



    return (
        <Container>
            <div className="m-3">
                <h2>Top Animes</h2>
                <AnimeCards animes={topAnimes}/>
            </div>
            {genres.map((genre) => 
                <AnimeGenre genre={genre} top={true}/>
            )}
        </Container>
    )
}