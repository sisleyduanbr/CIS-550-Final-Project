const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

//registration
app.post('/login_check', routes.login_check);
app.post('/create_account', routes.create_account);

//profile
app.get('/display_user_info', routes.display_user_info);
app.post('/update_profile', jsonParser, routes.update_profile);

//movie
app.get('/movie/watched/:username', routes.get_watched_movies);
app.post('/movie/add', jsonParser, routes.add_movie);
app.post('/movie/delete', routes.delete_movie);
app.get('/movie/search', routes.movie_search);
app.get('/movie/recommendation', routes.movie_rec);
app.get('/movie/top', routes.top_movies)
app.get('/movie/top/:genre', routes.top_movies_genre)

//anime

//anime ranking
app.get('/anime', routes.get_top_anime);
app.get('/anime/genre', routes.get_top_anime_genre);

//anime watch list
app.get('/anime/watched', routes.anime_watchlist);
app.post('/anime/add_anime', routes.anime_addinterest);
app.post('/anime/remove_anime', routes.anime_removeinterest);
app.post('/anime/watched_anime', routes.anime_updatewatched);

//anime search
app.get('/anime/search', routes.anime_search);
/* 

------ registration/authentication ------
/login_check (POST)
/create_account (POST)

------ profile ------
/display_user_info/:user
/update_profile (POST)


------ movie ------
/movie/watched/:username
/movie/watched/:username (POST)
/movie/search/:searchstring (POST)
/movie/rec/:username 

------ anime ------
/anime/rec/genres/:username
/anime/rec/genre/:genre/:username
/anime/rec/:username (POST)

------ anime ranking ------ 
/anime
/anime/:genre

------ anime watch list ------ 
/anime/watch/:username
/anime/add_anime/:username (ADD anime to interest list)
/anime/remove_anime/:username (DELETE entry from interest list)
/anime/watched_anime/:username (update anime from interest list to watched)

------ anime search ------
anime/search:anime_title


*/

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
