import { useContext, useEffect, useState } from "react";
import { AuthContext } from './Contexts';
import { jwtToken, userData } from "./Signals";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



  function UserInfo() {
    const { isLoggedIn } = useContext(AuthContext); // Use isLoggedIn
    useEffect(() => {
        console.log("UserData updated:", userData.value);
    }, [userData.value]);

    const formatCreationTime = (timestamp) => {
        if (!timestamp) {
            return 'No creation time';
        }
        

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
        {isLoggedIn ? ( // Check if the user is logged in
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
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
  
    function handleLogin() {
      axios.post('http://localhost:3001/User/login', { uname, pw })
        .then(resp => {
          if (resp.data && resp.data.jwtToken) {
            jwtToken.value = resp.data.jwtToken;
            userData.value = resp.data.userData;
            login(); // Call login from context
            navigate('/'); // Redirect to home page
          } else {
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
        <button onClick={handleLogin}>Login</button>
        <p>No account? <Link to="/register">Create a new account</Link>.</p>
      </div>
    );
  }
  
  function Login() {
    const { isLoggedIn, logout } = useContext(AuthContext);
   // Log when isLoggedIn changes
   useEffect(() => {
    console.log('User is logged in:', isLoggedIn);
  }, [isLoggedIn]);

    return (
      <div>
        <UserInfo/>
        { !isLoggedIn ? <LoginForm/> : 
          <button onClick={logout}>Logout</button>}
      </div>
    );
  }

export {Login};