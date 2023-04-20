const mysql = require('mysql')
const config = require('./config.json')
var sha256 = require('js-sha256');

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/* ACCOUNT ROUTES */

const loginCheck = async function(req, res) {
  const username = req.body.username;
  const password = sha256(req.body.password);

  connection.query(`
    SELECT username
    FROM user
    WHERE username = "${username}" AND password = "${password}"
  `, (err, data) => {
    if (err || data.length == 0) {
      console.log(err);
      res.json({});
    } else {
      session = req.session;
      session.userId = username;
      res.send(data);
    }
  });
}

const createAccount = async function(req, res) {
  const username = req.body.username;
  const password = sha256(req.body.password);
  const occupation = req.body.occupation;
  const age = req.body.age;
  const gender = req.body.gender;
  const zipcode = req.body.zipcode;

  connection.query(`
    INSERT INTO user
    VALUES ("${username}", "${password}", "${occupation}", "${age}", "${gender}", "${zipcode}")
  `, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(username);
    }
  })
}

/* PROFILE ROUTES */

const displayUserInfo = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }  

  connection.query(`
    SELECT *
    FROM user
    WHERE username = "${req.session.userId}"
  `, (err, data) => {
    if (err || data.length == 0) {
      console.log(err);
      res.json({});
    } else {
      res.send(data);
    }
  })
}

const updateProfile = async function(req, res) {
  const new_username = req.body.username;
  const new_password = req.body.password;
  const new_occupation = req.body.occupation;
  const new_age = req.body.age;
  const new_gender = req.body.gender;
  const new_zipcode = req.body.zipcode;

  connection.query(`
    UPDATE user
    SET username = "${new_username}", password = "${new_password}", occupation = "${new_occupation}", age = "${new_age}", gender = "${new_gender}", zipcode = "${new_zipcode}"
    WHERE username = "${session.userId}"
  `, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
}

/* MOVIE PAGE ROUTES */

// /movie/watched/:username
const getWatchedMovies = async function(req, res) {
  username = req.params.username;
  connection.query(`
    SELECT M.title, M.imdb_id
    FROM watched W JOIN movie M ON M.id = W.movie_id
    WHERE username = "${username}"
  `, (err, data) => {
    err ? console.log(err) : res.send(data)
  });
}
// /add_movie
const addMovieToWatched = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = req.session.userId;
  const movie_id = req.body.movie_id;
  const unique_id = username + '%' + movie_id;
  connection.query(`
    INSERT INTO watched (unique_id, username, movie_id)
    VALUES ("${unique_id}", "${username}", "${movie_id}");
  `, (err, data) => {
    err ? console.log(err) : console.log(data)
  });
}

// /delete_movie
const deleteMovieFromWatched = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = req.session.userId;
  const movie_id = req.body.movie_id;
  const unique_id = username + '%' + movie_id;
  connection.query(`
    DELETE FROM watched
    WHERE unique_id = "${unique_id}"
  `, (err, data) => {
    err ? console.log(err) : console.log(data)
  });
}


/* ANIME WATCH LIST */

const animeWatchlist = async function(req, res) {
  const username = req.session.userId;
  connection.query(`
      WITH anime_
  `)
}

const animeAddInterest = async function(req, res) {

}

const animeRemoveInterest = async function(req, res) {

}

const animeUpdateWatched = async function(req, res) {

}

/* ANIME SEARCH ROUTES */

const animeSearch = async function(req, res) {
  const anime_title = req.query.anime;

  connection.query(`
    WITH anime_id AS (
      SELECT anime.id, genre
      FROM genre_anime JOIN anime ON genre_anime.id = anime.id
      WHERE anime.title LIKE "%${anime_title}" OR anime.title LIKE "${anime_title}%" OR anime.title LIKE "%${anime_title}%" OR anime.title = "${anime_title}"
    ),
    anime_desc AS (
      SELECT a.id, a.title, a.avg_rating, a.synopsis, a.type, a.num_episodes
      FROM anime a
      WHERE a.title LIKE "%${anime_title}" OR a.title LIKE "${anime_title}%" OR a.title LIKE "%${anime_title}%" OR a.title = "${anime_title}"
    )
    SELECT DISTINCT ad.id, ad.title, ad.avg_rating, ad.synopsis, ad.type, ad.num_episodes, JSON_EXTRACT(JSON_ARRAYAGG(JSON_OBJECT("genre", genre)), '$[*].genre') as genres
    FROM anime_desc ad JOIN anime_id ai on ad.id = ai.id
    GROUP BY ad.id
  `, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

// ANIME RANKING

// top animes
// /anime
const getTopAnimes = async function(req, res) {
  connection.query(`
    SELECT *
    FROM anime
    ORDER BY avg_rating DESC
    LIMIT 8
  `, (err, data) => {
    if (err) console.log(err)
    else res.json(data)
  });
}



var routes = {
  login_check: loginCheck,
  create_account: createAccount,
  display_user_info: displayUserInfo,
  update_profile: updateProfile,
  get_watched_movies: getWatchedMovies,
  anime_watchlist: animeWatchlist,
  anime_addinterest: animeAddInterest,
  anime_removeinterest: animeRemoveInterest,
  anime_updatewatched: animeUpdateWatched,
  anime_search: animeSearch,
  add_movie: addMovieToWatched,
  delete_movie: deleteMovieFromWatched,
  get_top_anime: getTopAnimes
};

module.exports = routes;