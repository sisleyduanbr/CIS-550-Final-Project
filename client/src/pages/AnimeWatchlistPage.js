import { Container } from "@mui/system";
import { useState, useEffect } from "react";
import {LoginContext} from "../contexts/LoginContext";
import React, {useContext} from 'react'
import AnimeCards from '../components/AnimeCards'
import background from "../images/image9.jpeg";
const config = require('../config.json');

export default function AnimeWatchlistPage() {
    const [animesInInterestlist, setAnimesInInterestlist] = useState([]);
    const {username} = useContext(LoginContext);

    useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/anime/interested/${username}`)
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
            <h2>{username}'s Interest List</h2>
            <AnimeCards animes={animesInInterestlist} interestList={true}/>
        </Container>
        </div>

    )
}