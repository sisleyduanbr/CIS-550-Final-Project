import { Container } from "@mui/system";
import { useState } from "react";
import TempCards from "../components/TempCard";
import animes from "../data/anime";

export default function AnimeWatchlistPage() {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);

    useState(() => {
        setAnimesInWatchlist(animes);
    })

    return (
        <Container>
            <h2>Anime Watch List</h2>
            <TempCards objs={animesInWatchlist}/>
        </Container>
    )
}