import AnimeGenre from "./AnimeGenre";
import anime_genres from "../data/anime_genres";
import { useEffect, useState } from "react";
import { Container, Divider } from "@mui/material";

export default function AnimeRankingsPage() {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        setGenres(anime_genres);
    });

    return (
        <Container>
        <h2> Recommended animes by genre: </h2>
        <Divider />
        {genres.map((genre) => 
            <AnimeGenre genre={genre}/>
        )}

        {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]}/> */}

        </Container>
    )
}