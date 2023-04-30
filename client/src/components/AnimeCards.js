import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck, mdiEye, mdiPlusBox, mdiPlaylistCheck, mdiEyePlus, mdiEyeCheck  } from '@mdi/js';
import { useState, useEffect, useContext } from "react";
import http from '../HttpService';
import { LoginContext } from "../contexts/LoginContext";
import Modal from 'react-modal';
import Detail from "./Detail";
const config = require('../config.json');
const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      },
    content: {
        top: "20%",
        left: "20%",
        bottom: '20%',
        backgroundColor: "white",
        width: '60%'
      },
}

export default function AnimeCards({animes, interestList}) {
    const [animesInWatchlist, setAnimesInWatchlist] = useState([]);
    const [animesInInterestlist, setAnimesInInterestlist] = useState([]);
    const {username} = useContext(LoginContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAnime, setModalAnime] = useState({});


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
    
    const handleModalOpen = (anime) => {
        setModalOpen(true)
        setModalAnime(anime);
    }
    const handleModalClose = () => {
        setModalOpen(false);
    }

    return (
        <div style={flexFormat} className="justify-content-start">
            {/* {animes.length == 0 && 
                <div> No animes to display! </div>
            } */}
            {animes.map((anime) => (
                <div className="p-3 card col-2 m-2">
                    <div onClick={() => handleModalOpen(anime)}>
                        <div className="d-flex justify-content-start">
                            {anime.agg_score && <h4 className="text-bold"> {anime.agg_score.toPrecision(3)} </h4>}
                        </div>
                        <h5>{anime.title}</h5>
                    </div>
                    <div> avg rating: {anime.avg_rating}</div>
                    <div> #episodes: {anime.num_episodes} </div>
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
            <Modal isOpen={!!modalOpen} 
                style={modalStyle} 
                ariaHideApp={false}
                onRequestClose={handleModalClose}>
                <div className="d-flex justify-content-center">
                    <div className='p-3'>
                        <Detail anime={modalAnime}/>
                    </div>
                </div>
            </Modal>
        </div>
    )
}