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

  function UserInfo() {
    useEffect(() => {
        console.log("UserData updated:", userData.value);
    }, [userData.value]);

    const formatCreationTime = (timestamp) => {
        if (!timestamp) {
            return 'No creation time';
        }
        
        console.log("Raw Creation Time:", timestamp);

        let date;
        if (typeof timestamp === 'number') {
            // Assuming timestamp is in seconds
            date = new Date(timestamp * 1000);
        } else if (typeof timestamp === 'string') {
            // If the timestamp is in a string format, like ISO 8601
            date = new Date(timestamp);
        } else {
            return 'Invalid Format';
        }

        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const formattedCreationTime = formatCreationTime(userData.value?.creation_time);

    return (
        <div>
            {jwtToken.value ? (
                <>
                    <h1>{userData.value?.private}</h1>
                    <p>Account Created On: {formattedCreationTime}</p>
                </>
            ) : (
                <h1>You are a guest</h1>
            )}
        </div>
    );
}


  

  function LoginForm() {
    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');
  
    function login() {
      axios.post('http://localhost:3001/User/login', { uname, pw })
    .then(resp => {
      console.log(resp.data);
      if (resp.data && resp.data.jwtToken) {
        jwtToken.value = resp.data.jwtToken;
        // Assuming resp.data.userData contains user data including creation_time
        userData.value = resp.data.userData;
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