import { effect, signal } from "@preact/signals-react";
import axios from "axios";

// Export the getSessionToken function
export function getSessionToken(){
    const t = sessionStorage.getItem('token');
    return t === null || t === 'null' ? '' : t;
}

export const jwtToken = signal(getSessionToken());
export const userData = signal(null);

effect(() => {
    // Save the JWT token in sessionStorage whenever it changes
    sessionStorage.setItem('token', jwtToken.value);    

    // If the JWT token is present, fetch user data
    if(jwtToken.value.length > 0){
        const config = {headers: { Authorization: 'Bearer ' + jwtToken.value }};
        axios.get('http://localhost:3001/user/private', config)
            .then(resp => {
                // Update userData signal with the fetched data
                userData.value = resp.data;
            })
            .catch(err => {
                console.log(err.response ? err.response.data : err);
                // Reset jwtToken and userData if there's an error (e.g., token expired)
                jwtToken.value = '';
                userData.value = null;
            });
    }
});
