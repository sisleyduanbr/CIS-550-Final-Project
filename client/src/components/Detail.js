export default function Detail({anime}) {

    return (
        <div>
            <h2 className="mb-3">{anime.title}</h2>
            {anime.synopsis}
        </div>
    )
}