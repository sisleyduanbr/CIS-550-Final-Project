import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck, mdiEye, mdiPlusBox, mdiPlaylistCheck, mdiEyePlus, mdiEyeCheck  } from '@mdi/js';
import { useState, useEffect, useContext } from "react";
import http from '../HttpService';
import { LoginContext } from "../contexts/LoginContext";
const config = require('../config.json');
const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function AnimeCards({animes, interestList}) {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    const [animesInInterestlist, setAnimesInInterestlist] = useState([]);
    const {username} = useContext(LoginContext);
    // animes on watch list

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/anime/watched?username=${username}`)
          .then(res => res.json())
          .then(resJson => {
              console.log(resJson)
              setAnimesInWatchlist(resJson);
          });
      }, [])

      useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/anime/interested?username=${username}`)
          .then(res => res.json())
          .then(resJson => {
              console.log(resJson)
              setAnimesInInterestlist(resJson);
          });
      }, [])
    
    const handleInterested = (anime) => {
        http.post('/anime/add_anime', {anime_id: anime.id, username: username});
        setAnimesInInterestlist([...animesInInterestlist, anime]);
    }

    const handleWatched = (anime) => {
        http.post('/anime/watched_anime', {userId: username, anime_id: anime.id});
        setAnimesInWatchlist([...animesInWatchlist, anime]);
    }

    return (
        <div style={flexFormat} className="justify-content-start">
            {animes.length == 0 && 
                <div> No animes to display! </div>
            }
            {animes.map((anime) => (
                <div className="p-3 card col-3">
                    <div>
                        <h5>{anime.title}</h5>
                        {/* {anime.synopsis.slice(0, 100)}... */}
                    </div>
                    <div> number of episodes: {anime.num_episodes} </div>
                    <div> type: {anime.type} </div>

                    <div className="d-flex">
                        {animesInWatchlist.find((a) => a.title == anime.title) != null &&
                        <Icon path={mdiCheck} size={1} />}
                        
                        {animesInInterestlist.find((a) => a.title == anime.title) == null && 
                        animesInWatchlist.find((a) => a.title == anime.title) == null &&
                        !interestList ?
                        <div onClick={() => handleInterested(anime)}>
                            <Icon path={mdiPlusBox } size={1} />
                        </div>
                        : 
                        <div>
                            {!interestList && <Icon path={mdiPlaylistCheck} size={1} />}
                        </div>}

                        {interestList && animesInWatchlist.find((a) => a.title == anime.title) == null &&
                        <div onClick={() => handleWatched(anime)}>
                            <Icon path={mdiEyePlus} size={1} />
                        </div>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}