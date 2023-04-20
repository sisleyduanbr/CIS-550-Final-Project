import { Card } from "@mui/material";
const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function AnimeCards({animes}) {
    console.log(animes[0])
    return (
        <div style={flexFormat}>
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