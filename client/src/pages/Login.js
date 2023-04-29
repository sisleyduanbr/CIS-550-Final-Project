import { useRef, useState, useEffect, useContext} from 'react';
import {LoginContext} from "../contexts/LoginContext";
const config = require('../config.json');



function Login(){

  const {setUsername} = useContext(LoginContext);
  const {setPassword} = useContext(LoginContext);
  const [data, setData] = useState([]);
  var username = "";
  var password = "";
 
  return (
    <section>
      <h1>Log In</h1>
      <input type = "text" placeholder = "Username.." 
      onChange={(e) => {username = e.target.value}}
      ></input>
      <br></br>
      <input type = "text" placeholder = "Password.."
      onChange={(e) => {password = e.target.value}}
      ></input>
      <br></br>
      <button onClick={(e) => checkLogin()}>Log In</button>
    </section>
  )

  function error() {
    <h1>Username or password is incorrect</h1>
  }

  function checkLogin() {

    fetch(`http://${config.server_host}:${config.server_port}/loginCheck?username=${username}&password=${password}`)
    .then(res => res.json())
    .then(resJson => setData(resJson));
    console.log(data);
    if(data == {}) {
      //account doesnt exist
      setStuff();
    } else {
      setStuff();
    }
  }

  function setStuff() {
    setUsername(username);
    setPassword(password);
  }
} 

export default Login