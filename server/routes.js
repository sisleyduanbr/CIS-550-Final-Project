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
  const password = req.body.password;

  connection.query(`
    SELECT *
    FROM user
    WHERE username = "${username}" AND pw = "${password}"
  `, (err, data) => {
    if (err || data.length == 0) {
      console.log(err);
      res.json({});
    } else {
      req.session.userId = 'user1' //data[0].username
      console.log("req session after login is", req.session);
      req.session.save(function () {
        res.send(data);
      });
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
    SELECT M.title, M.imdb_id, M.id
    FROM watched W JOIN movie M ON M.id = W.movie_id
    WHERE username = "${username}"
  `, (err, data) => {
    err ? console.log(err) : res.send(data)
  });
}
// add_movie
const addMovieToWatched = async function(req, res) {
  // if (req.session.userId == null) {
  //   res.redirect('/');
  // }
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
  const {username} = req.params;

  connection.query(`
    SELECT DISTINCT M.title, M.avg_rating, M.imdb_id,  M.id
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

/* ANIME RECOMMENDATIONS */

//recommendation algorithm = (number_of_genres_anime_total_count / number_of_genres_in_anime) * 0.7 + (anime_rating) * 0.3

const getAnimeRecUser = async function(req, res) {
  ///const page = req.query.page;
  //const page_size = req.query.page_size;
  //const pageSize = page_size ? page_size : 10;
  // if (req.session.userId == null) {
  //   console.log("req session in ge anime user is", req.session);
  //   return res.json([]);
  // }
  const {username} = req.params;
  connection.query(`
    WITH user_genre_counts AS (
      SELECT genre, COUNT(*) AS count
      FROM genre_movie JOIN watched ON genre_movie.id = watched.movie_id
      WHERE watched.username = "${username}" AND genre != "(no genres listed)"
      GROUP BY genre
    ), anime_genre_counts AS (
      SELECT anime.id, genre, COUNT(*) AS count
      FROM anime JOIN genre_anime ON anime.id = genre_anime.id
      GROUP BY id, genre
    ), anime_total_counts AS (
      SELECT anime.id, COUNT(*) as total_genres, SUM(COALESCE(user_genre_counts.count, 0) * anime_genre_counts.count) as matching
      FROM anime JOIN anime_genre_counts ON anime.id = anime_genre_counts.id
             LEFT JOIN user_genre_counts ON anime_genre_counts.genre = user_genre_counts.genre
      GROUP BY id
    ), anime_score AS (
      SELECT id, (matching / total_genres) AS score
      FROM anime_total_counts
    ), anime_ratings AS (
      SELECT id, avg_rating
      FROM anime
    ), recommended_anime AS (
      SELECT anime_score.id, ((score * 0.7) + (avg_rating * 0.3)) as agg_score
      FROM anime_score JOIN anime_ratings ON anime_score.id = anime_ratings.id
    ), anime_id AS (
      SELECT recommended_anime.id, genre
      FROM genre_anime JOIN recommended_anime ON genre_anime.id = recommended_anime.id
      WHERE genre_anime.id = recommended_anime.id
    ),
    anime_desc AS (
      SELECT a.id, a.title, a.avg_rating, a.synopsis, a.type, a.num_episodes, recommended_anime.agg_score
      FROM anime a JOIN recommended_anime ON recommended_anime.id = a.id
      WHERE recommended_anime.id = a.id
    )
    SELECT DISTINCT ad.id, ad.title, ad.avg_rating, ad.agg_score, ad.synopsis, ad.type, ad.num_episodes, JSON_EXTRACT(JSON_ARRAYAGG(JSON_OBJECT("genre", genre)), '$[*].genre') as genres
    FROM anime_desc ad JOIN anime_id ai on ad.id = ai.id
    GROUP BY ad.id
    ORDER BY ad.agg_score DESC
    LIMIT 10
  `, (err, data) => {
    if (err) console.log(err);
    else res.json(data);
  })
}

const getAnimeRecUserGenre = async function(req, res) {
  const genre = req.query.genre;

  ///const page = req.query.page;
  //const page_size = req.query.page_size;
  //const pageSize = page_size ? page_size : 10;

  //const username = req.session.userId;
  const username = req.query.username;

  connection.query(`
    WITH user_genre_counts AS (
      SELECT genre, COUNT(*) AS count
      FROM genre_movie JOIN watched ON genre_movie.id = watched.movie_id
      WHERE watched.username = "${username}" AND genre = "${genre}"
      GROUP BY genre
    ), anime_genre_counts AS (
      SELECT anime.id, genre, COUNT(*) AS count
      FROM anime JOIN genre_anime ON anime.id = genre_anime.id
      GROUP BY id, genre
    ), anime_total_counts AS (
      SELECT anime.id, COUNT(*) as total_genres, SUM(COALESCE(user_genre_counts.count, 0) * anime_genre_counts.count) as matching
      FROM anime JOIN anime_genre_counts ON anime.id = anime_genre_counts.id
            LEFT JOIN user_genre_counts ON anime_genre_counts.genre = user_genre_counts.genre
      GROUP BY id
    ), anime_score AS (
      SELECT id, (matching / total_genres) AS score
      FROM anime_total_counts
    ), anime_ratings AS (
      SELECT id, avg_rating
      FROM anime
    ), recommended_anime AS (
      SELECT anime_score.id, ((score * 0.7) + (avg_rating * 0.3)) as agg_score
      FROM anime_score JOIN anime_ratings ON anime_score.id = anime_ratings.id
    ), anime_id AS (
      SELECT recommended_anime.id, genre
      FROM genre_anime JOIN recommended_anime ON genre_anime.id = recommended_anime.id
      WHERE genre_anime.id = recommended_anime.id
    ),
    anime_desc AS (
      SELECT a.id, a.title, a.avg_rating, a.synopsis, a.type, a.num_episodes, recommended_anime.agg_score
      FROM anime a JOIN recommended_anime ON recommended_anime.id = a.id
      WHERE recommended_anime.id = a.id
    )
    SELECT DISTINCT ad.id, ad.title, ad.avg_rating, ad.agg_score, ad.synopsis, ad.type, ad.num_episodes, JSON_EXTRACT(JSON_ARRAYAGG(JSON_OBJECT("genre", genre)), '$[*].genre') as genres
    FROM anime_desc ad JOIN anime_id ai on ad.id = ai.id
    GROUP BY ad.id
    ORDER BY ad.agg_score DESC
    LIMIT 10
  `, (err, data) => {
    if (err) console.log(err);
    else res.json(data);
  })
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

const animeInterestList = async function(req, res) {
  const username = req.params.username;
  console.log("username is", username)

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

const animeWatchList = async function(req, res) {
  const username = req.query.username;
  //const username = req.session.userId;
  connection.query(`
  WITH anime_interests AS (
    SELECT anime_id
    FROM watchlist
    WHERE username = "${username}" AND watched = 1
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
  // if (req.session.userId == null) {
  //   res.redirect('/');
  // }
  const username = req.body.username //req.session.userId; 
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
  // if (req.session.userId == null) {
  //   res.redirect('/');
  // }
  const username = req.body.userId;
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
  get_anime_rec_user: getAnimeRecUser,
  get_anime_rec_user_genre: getAnimeRecUserGenre,
  anime_interestlist: animeInterestList,
  anime_watchlist: animeWatchList,
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