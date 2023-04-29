import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { useState, useEffect } from "react";
const config = require('../config.json');

const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function AnimeCards({animes}) {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    // animes on watch list

    useEffect(() => {
        const username = 'user1'
        fetch(`http://${config.server_host}:${config.server_port}/anime/watched?username=${username}`)
          .then(res => res.json())
          .then(resJson => {
              console.log(resJson)
              setAnimesInWatchlist(resJson);
          });
      },[animesInWatchlist])

    return (
        <div style={flexFormat} className="justify-content-start">
            {animes.map((anime) => (
                <div className="p-3 card col-3">
                    <div>
                        <h5>{anime.title}</h5>
                        {anime.synopsis.slice(0, 100)}...
                    </div>
                    <div> number of episodes: {anime.num_episodes} </div>
                    <div> type: {anime.type} </div>
                    {animesInWatchlist.find((a) => a.title == anime.title) != null && <Icon path={mdiCheck} size={1} />}
                </div>
            ))}
        </div>
    )
}