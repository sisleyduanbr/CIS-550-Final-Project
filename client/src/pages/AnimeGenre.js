import { useEffect, useState } from "react"
import animes from "../data/anime";
import { Container, Card} from '@mui/material';
import AnimeCards from "../components/AnimeCards";
const config = require('../config.json');

export default function AnimeGenre({genre}) {
    const [animesInGenre, setAnimesInGenre] = useState([]);

    // get all genres of users
    useEffect(() => {
        const page = 1
        fetch(`http://${config.server_host}:${config.server_port}/anime/genre?genre=${genre}&page=${page}&page_size=8`)
            .then(res => res.json())
            .then(resJson => {
                console.log(resJson)
                setAnimesInGenre(resJson)
            });
    }, [])

    return (
        <Container>
            <h4>{genre}</h4>
            <AnimeCards animes={animesInGenre}/>
        </Container>
    )
}