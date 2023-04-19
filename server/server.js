const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/movie/watched', routes.get_watched_movies);

/* 

------ registration/authentication ------
/login_check (POST)
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
/anime/watch/:username (DELETE)

------ anime search ------
anime/search:anime_title


*/

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
