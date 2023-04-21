import { Card } from "@mui/material";
const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function AnimeCards({animes}) {
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
                </div>
            ))}
        </div>
    )
}