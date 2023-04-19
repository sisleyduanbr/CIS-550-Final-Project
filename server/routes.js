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
  const username = req.query.username;

  connection.query(`
    SELECT *
    FROM user
    WHERE username = "${username}"
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

var routes = {
  login_check: loginCheck,
  create_account: createAccount,
  display_user_info: displayUserInfo,
  update_profile: updateProfile,
  get_watched_movies: getWatchedMovies,
};

module.exports = routes;