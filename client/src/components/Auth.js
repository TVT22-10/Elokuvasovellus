import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./Contexts";
import { jwtToken, userData } from "./Signals";
import axios from "axios";
import { Link } from 'react-router-dom';


function Login() {

    return (
      <div>
        <UserInfo/>
        { jwtToken.value.length === 0 ? <LoginForm/> : 
          <button onClick={() => jwtToken.value = ''}>Logout</button>}
      </div>
    );
  }

  function UserInfo(){

    return(
      <div>
        {jwtToken.value ? <h1>{userData.value?.private}</h1> : <h1>You are guest</h1>}
      </div>
    )
  }

  function LoginForm() {
    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');
  
    function login() {
      axios.post('http://localhost:3001/User/login', { uname, pw })
        .then(resp => {
          if (resp.data && resp.data.jwtToken) {
            jwtToken.value = resp.data.jwtToken;
          } else {
            // Handle the case where jwtToken is not in the response
            console.log('JWT Token not found in response');
          }
        })
        .catch(error => {
          console.log(error.response ? error.response.data : error);
        });
    }
  
    return (
      <div>
        <input value={uname} onChange={e => setUname(e.target.value)} />
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} />
        <button onClick={login}>Login</button>
        <p>No account? <Link to="/register">Create a new account</Link>.</p>
      </div>
    );
  }
  

export {Login};