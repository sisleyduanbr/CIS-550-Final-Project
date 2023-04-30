import { Container } from "@mui/system";
import { useState, useEffect } from "react";
import animes from "../data/anime";
import {LoginContext} from "../contexts/LoginContext";
import React, {useContext} from 'react'
import AnimeCards from '../components/AnimeCards'
import background from "../images/image9.jpeg";
const config = require('../config.json');

export default function AnimeWatchlistPage() {
    const [animesInInterestlist, setAnimesInInterestlist] = useState([]);
    const {username} = useContext(LoginContext);
    const {password} = useContext(LoginContext);
    const {age} = useContext(LoginContext);
    const {gender} = useContext(LoginContext);
    const {occupation} = useContext(LoginContext);

    useEffect(() => {
    const username = 'user1'
    fetch(`http://${config.server_host}:${config.server_port}/anime/interested?username=${username}`)
        .then(res => res.json())
        .then(resJson => {
            console.log(resJson)
            setAnimesInInterestlist(resJson);
        });
    },[])

    return (
        <div style={{
            backgroundImage: `url(${background})`
        }}>
        <Container>
            <h2>Anime Interest List</h2>
            <AnimeCards animes={animesInInterestlist}/>
        </Container>
        </div>

    )
}