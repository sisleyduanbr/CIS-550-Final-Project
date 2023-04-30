import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck, mdiEyePlus } from '@mdi/js';
import { useState, useEffect, useContext } from "react";
import http from '../HttpService';
import { LoginContext } from "../contexts/LoginContext";
const config = require('../config.json');

const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function MovieCards({movies}) {
    const [watchedMovies, setWatchedMovies] = useState([]);
    const {username} = useContext(LoginContext);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/movie/watched/${username}`)
        .then(res => res.json())
        .then(resJson => {
            console.log(resJson)
            setWatchedMovies(resJson);
        });
    },[])

    const handleWatched = (movie) => {
        console.log(movie)
        http.post('/movie/add', {movie_id: movie.id});
        setWatchedMovies([...watchedMovies, movie]);
    }

    return (
        <div style={flexFormat} className="justify-content-start">
            {movies.map((movie, i) => (
                <div className="p-3 card col-2 m-2">
                    <div>
                        <h5>{movie.title}</h5>
                    </div>
                    {movie.avg_rating && <div>
                        avg rating: {movie.avg_rating.toPrecision(3)}
                    </div>}
                    {watchedMovies.find((m) => m.title == movie.title) != null ?
                    <Icon path={mdiCheck} size={1} />
                    :
                    <div onClick={() => handleWatched(movie)}>
                        <Icon path={mdiEyePlus} size={1} />
                    </div>}
                </div>
            ))}
        </div>
    )
}