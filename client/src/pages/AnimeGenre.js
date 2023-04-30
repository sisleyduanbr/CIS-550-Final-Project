import { useContext, useEffect, useState } from "react"
import animes from "../data/anime";
import { Container, Card} from '@mui/material';
import AnimeCards from "../components/AnimeCards";
import { LoginContext } from '../contexts/LoginContext';
const config = require('../config.json');

export default function AnimeGenre({genre, top}) {
    const [animesInGenre, setAnimesInGenre] = useState([]);
    const {username, password, setPassword, age, setAge, gender, setGender, occupation, setOccupation} = useContext(LoginContext);

    // get all genres of users
    useEffect(() => {
        const page = 1
        fetch(`http://${config.server_host}:${config.server_port}/anime/${top ? "": `rec/`}genre?username=${username}&genre=${genre}&page=${page}&page_size=8`)
            .then(res => res.json())
            .then(resJson => {
                setAnimesInGenre(resJson)
            });
    }, [])

    return (
        <div className="m-3">
            {top ? 
            <h4>Top {genre} Animes</h4>
            :
            <h4>{genre} Animes You Might Like</h4>
            }
            <AnimeCards animes={animesInGenre}/>
        </div>
    )
}