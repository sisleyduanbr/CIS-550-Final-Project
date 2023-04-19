const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/* routes functions */


// /movie/watched/:username
const getWatchedMovies = async function(req, res) {
  connection.query(`
    SELECT *
    FROM movie
    LIMIT 10
  `, (err, data) => {
    err ? console.log(err) : console.log(data)
  });
}


/*
EXAMPLE FROM SWIFTIFY 

const random = async function(req, res) {
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        song_id: data[0].song_id,
        title: data[0].title
      });
    }
  });
}

*/

module.exports = {
  get_watched_movies: getWatchedMovies
}
