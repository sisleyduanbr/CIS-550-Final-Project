import { Container } from "@mui/system";
import { useState } from "react";
import animes from "../data/anime";
import {LoginContext} from "../contexts/LoginContext";
import React, {useContext} from 'react'

export default function AnimeWatchlistPage() {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    const {username} = useContext(LoginContext);
    const {password} = useContext(LoginContext);

    useState(() => {
        setAnimesInWatchlist(animes);
    })

    return (
        <Container>
            <h2>Anime Watch List</h2>
            
            
        </Container>
    )
}