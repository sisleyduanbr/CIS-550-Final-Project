import { Card } from "@mui/material";
const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function MovieCards({movies}) {
    return (
        <div style={flexFormat} className="justify-content-start">
            {movies.map((movie) => (
                <div className="p-3 card col-3">
                    <div>
                        <h5>{movie.title}</h5>
                    </div>
                    <div>
                        Average ratings: {movie.avg_rating}
                    </div>
                </div>
            ))}
        </div>
    )
}