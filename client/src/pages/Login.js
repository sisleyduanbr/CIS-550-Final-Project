import { useRef, useState, useEffect, useContext} from 'react';
import {LoginContext} from "../contexts/LoginContext";
import http from "../HttpService";
const config = require('../config.json');





function Login(){

  const {setUsername} = useContext(LoginContext);
  const {setPassword} = useContext(LoginContext);
  const {setAge} = useContext(LoginContext);
  const {setGender} = useContext(LoginContext);
  const {setOccupation} = useContext(LoginContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [valid, setValid] = useState(true);
  
 
  const checkLogin = async () => {
    
    const {data} = await http.post("/login_check", {username: user, password: pass})
    if(Object.keys(data).length === 0 && data.constructor === Object) {
      console.log("account not found");
      setValid(false);
    } else {
      setUsername(user);
      setPassword(pass);
      setAge(data[0].age);
      setGender(data[0].gender);
      setOccupation(data[0].occupation);
    }
  }

  return (
    <section>
      <h1>Log In</h1>
      <input type = "text" placeholder = "Username.." 
      onChange={(e) => {setUser(e.target.value)}}
      ></input>
      <br></br>
      <input type = "text" placeholder = "Password.."
      onChange={(e) => {setPass(e.target.value)}}
      ></input>
      <br></br>
      <button onClick={checkLogin}>Log In</button>
      {!valid && <h1>Invalid Username or Password</h1>}
    </section>
  )

  function error() {
    <h1>Username or password is incorrect</h1>
  }


} 

export default Login