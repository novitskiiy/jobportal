import axios from 'axios';
const base_url = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/auth/`
const loginUser = async (login:any)=> {
    return axios.post(`${base_url}login`, login)
        .then((result:any) => result.data)
        .catch((error:any) =>{throw error;});
}

export {loginUser};