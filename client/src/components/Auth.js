import { useContext, useState } from "react";
import { LoginContext } from "./Contexts";
import { jwtToken } from "./Signals";
import axios from 'axios';


function Login() {

  return (
    <div>
      <LoginForm/>
    </div>
  );
}

function LoginForm() {

  const[uname, setUname] = useState('');
  const[pw, setPw] = useState('');

  function login() {
    axios.postForm('http://localhost:3001/User/login', {uname, pw})
    .then(resp => console.log(resp.body))
    .catch(error => console.log(error.message))
  }   

  return(
    <div>
      <input value={uname} onChange={e => setUname(e.target.value)} />
      <input value={pw} onChange={e => setPw(e.target.value)} />
      <button onClick={login}>login</button>
    </div>
);
}



export {Login};