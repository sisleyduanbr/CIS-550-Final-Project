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
  const new_password = req.body.pw;
  const new_occupation = req.body.occupation;
  const new_age = req.body.age;
  const new_gender = req.body.gender;
  const new_zipcode = req.body.zip_code;

  connection.query(`
    UPDATE user
    SET username = "${new_username}", pw = "${new_password}", occupation = "${new_occupation}", age = "${new_age}", gender = "${new_gender}", zip_code = "${new_zipcode}"
    WHERE username = "${new_username}"
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
// add_movie
const addMovieToWatched = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = "user1" //req.session.userId;
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

const movieSearch = async function(req, res) {
  const movie_title = req.query.title;

  connection.query(`
    WITH movie_id AS (
      SELECT M.id, G.genre
      FROM genre_movie G JOIN movie M ON G.id = M.id
      WHERE M.title LIKE "%${movie_title}" OR M.title LIKE "${movie_title}%" OR M.title LIKE "%${movie_title}%" OR M.title = "${movie_title}"
    ),
    movie_desc AS (
      SELECT *
      FROM movie
      WHERE title LIKE "%${movie_title}" OR title LIKE "${movie_title}%" OR title LIKE "%${movie_title}%" OR title = "${movie_title}"
    )
    SELECT DISTINCT md.title, md.avg_rating, md.imdb_id, JSON_EXTRACT(JSON_ARRAYAGG(JSON_OBJECT("genre", genre)), '$[*].genre') as genres
    FROM movie_desc md JOIN movie_id mi on md.id = mi.id
    GROUP BY md.id
  `, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

// "Personalized recommendation", for users who already marked movies they have watched
const movieRec = async function(req, res) {
  /*
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = req.session.userId;
  */
  const page = req.query.page;
  const page_size = req.query.page_size;
  const pageSize = page_size ? page_size : 10;
  const username = "user1"; // FOR TESTING ONLY

  connection.query(`
    SELECT M.title, M.avg_rating, M.imdb_id
    FROM movie M JOIN genre_movie G ON M.id = G.id
    WHERE G.genre IN (
      SELECT G.genre
      FROM watched W JOIN genre_movie G on W.movie_id = G.id
      WHERE W.username = "${username}"
    ) AND M.title NOT IN (
      SELECT M.title
      FROM movie M JOIN watched W ON M.id = W.movie_id
      WHERE W.username = '${username}'
    )
    ORDER BY M.avg_rating DESC
    LIMIT ${page_size} OFFSET ${((page - 1) * pageSize)}
  `, (err, data) => {
    err ? console.log(err) : res.send(data)
  });
}

// Recommend Top movies
const getTopMovies = async function(req, res) {
  const page = req.query.page;
  const page_size = req.query.page_size;
  const pageSize = page_size ? page_size : 10;
  connection.query(`
    SELECT *
    FROM movie
    ORDER BY avg_rating DESC
    LIMIT ${page_size} OFFSET ${((page - 1) * pageSize)}
  `, (err, data) => {
    if (err) console.log(err)
    else res.json(data)
  });
}

// Recommend Top movies by genre
const getTopMoviesByGenre = async function(req, res) {
  const genre = req.params.genre;
  const page = req.query.page;
  const page_size = req.query.page_size;
  const pageSize = page_size ? page_size : 10;
  connection.query(`
    SELECT M.title, M.avg_rating, M.imdb_id
    FROM movie M JOIN genre_movie G ON M.id = G.id
    WHERE G.genre = '${genre}'
    ORDER BY avg_rating DESC
    LIMIT ${page_size} OFFSET ${((page - 1) * pageSize)}
  `, (err, data) => {
    if (err) console.log(err)
    else res.json(data)
  });
}

/* ANIME RANKINGS */

const getTopAnimes = async function(req, res) {
  const page = req.query.page;
  const page_size = req.query.page_size;
  const pageSize = page_size ? page_size : 10;

  connection.query(`
    SELECT *
    FROM anime
    ORDER BY avg_rating DESC
    LIMIT ${page_size} OFFSET ${((page - 1) * pageSize)}
  `, (err, data) => {
    if (err) console.log(err)
    else res.json(data)
  });
}

const getTopAnimeGenre = async function(req, res) {
  const genre = req.query.genre;
  const page = req.query.page;
  const page_size = req.query.page_size;
  const pageSize = page_size ? page_size : 10;

  connection.query(`
    WITH anime_genre AS (
      SELECT id
      FROM genre_anime
      WHERE genre = "${genre}"
    ),
    top_ranks AS (
      SELECT anime.id, anime.title, anime.avg_rating, anime.synopsis, anime.type, anime.num_episodes
      FROM genre_anime JOIN anime ON genre_anime.id = anime.id
      GROUP BY anime.id
    ),
    top_anime AS (
      SELECT *
      FROM top_ranks
      ORDER BY avg_rating DESC
      LIMIT ${page_size} OFFSET ${((page - 1) * pageSize)}
    )
    SELECT DISTINCT top_anime.id, top_anime.title, top_anime.avg_rating, top_anime.synopsis, top_anime.type, top_anime.num_episodes, JSON_EXTRACT(JSON_ARRAYAGG(JSON_OBJECT("genre", genre)), '$[*].genre') as genres
    FROM genre_anime JOIN top_anime ON genre_anime.id = top_anime.id
    GROUP BY top_anime.id
  `, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

/*

*/

/* ANIME WATCH LIST */

const animeWatchlist = async function(req, res) {
  const username = req.query.username;
  
  //const username = req.session.userId;
  connection.query(`
      WITH anime_interests AS (
        SELECT anime_id
        FROM watchlist
        WHERE username = "${username}"
      ),
      anime_desc AS (
        SELECT a.id, a.title, a.avg_rating, a.synopsis, a.type, a.num_episodes
        FROM anime a JOIN anime_interests ai ON a.id = ai.anime_id
      ),
      anime_genre AS (
        SELECT genre_anime.id, genre_anime.genre
        FROM genre_anime JOIN anime_interests ON genre_anime.id = anime_interests.anime_id
      )
      SELECT DISTINCT ad.id, ad.title, ad.avg_rating, ad.synopsis, ad.type, ad.num_episodes, JSON_EXTRACT(JSON_ARRAYAGG(JSON_OBJECT("genre", genre)), '$[*].genre') as genres
      FROM anime_desc ad JOIn anime_genre ag ON ad.id = ag.id
      GROUP BY ad.id
  `, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.json(data);
    }
  })
}

const animeAddInterest = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = req.session.userId;
  const anime_id = req.body.anime_id;
  const unique_id = username + '%' + anime_id;
  connection.query(`
    INSERT INTO watchlist (unique_id, username, anime_id, watched)
    VALUES ("${unique_id}", "${username}", "${anime_id}", 0);
  `, (err, data) => {
    err ? console.log(err) : console.log(data)
  });
}

const animeRemoveInterest = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = req.session.userId;
  const anime_id = req.body.anime_id;
  const unique_id = username + '%' + anime_id;
  connection.query(`
    DELETE FROM watchlist
    WHERE unique_id = "${unique_id}"
  `, (err, data) => {
    err ? console.log(err) : console.log(data)
  });
}

const animeUpdateWatched = async function(req, res) {
  if (req.session.userId == null) {
    res.redirect('/');
  }
  const username = req.session.userId;
  const anime_id = req.body.anime_id;
  const unique_id = username + '%' + anime_id;
  connection.query(`
    UPDATE watchlist
    SET watched = 1
    WHERE unique_id = '${unique_id}'
  `, (err, data) => {
    err ? console.log(err) : console.log(data)
  });
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
  get_top_anime: getTopAnimes,
  get_top_anime_genre: getTopAnimeGenre,
  movie_search: movieSearch,
  movie_rec: movieRec,
  top_movies: getTopMovies,
  top_movies_genre: getTopMoviesByGenre,
};

module.exports = routes;