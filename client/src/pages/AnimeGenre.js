import { useEffect, useState } from "react"
import animes from "../data/anime";
import { Container, Card} from '@mui/material';
import TempCards from "../components/TempCard";

export default function AnimeGenre({genre}) {
    const [animesInGenre, setAnimesInGenre] = useState([]);

    useEffect(() => {
        setAnimesInGenre(animes);
    })
    return (
        <Container>
            <h4>{genre}</h4>
            <TempCards objs={animesInGenre}/>
        </Container>
    )
}