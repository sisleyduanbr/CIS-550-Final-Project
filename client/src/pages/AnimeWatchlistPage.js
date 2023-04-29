import { Container } from "@mui/system";
import { useState } from "react";
import animes from "../data/anime";
import {LoginContext} from "../contexts/LoginContext";
import React, {useContext} from 'react'

export default function AnimeWatchlistPage() {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    const {username} = useContext(LoginContext);
    const {password} = useContext(LoginContext);
    const {age} = useContext(LoginContext);
    const {gender} = useContext(LoginContext);
    const {occupation} = useContext(LoginContext);

    useState(() => {
        setAnimesInWatchlist(animes);
    })

    return (
        <Container>
            <h2>Anime Watch List</h2>
            <h2>Username: {username}</h2>
            <h2>Password: {password}</h2>
            <h2>Age: {age}</h2>
            <h2>Gender: {gender}</h2>
            <h2>Occupation: {occupation}</h2>
            
            
        </Container>
    )
}