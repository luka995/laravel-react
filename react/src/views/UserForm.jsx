import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id:null,
        name:'',
        email:'',
        password:'',
        password_confirmation:''
    });

    const {setNotification} = useStateContext();

    //bad, use contidion inside useEffect or in parent component
    if (id) {
        useEffect(()=> {
            setLoading(true);
            axiosClient.get(`/users/${id}`)
                .then(({data}) => {
                    setUser(data.data)
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                })
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User successfully updated');
                    navigate('/users');
                })
                .catch(err => {
                    const response = err.response;
                    //validation error
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                })
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification('User successfully created');
                    navigate('/users');
                })
                .catch(err => {
                    const response = err.response;
                    //validation error
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                })
        }
    }

    return (
        <>
            {user.id && <h1>Update user: {user.name}</h1>}
            {!user.id && <h1>Create user:</h1>}

            <div className='card animated fadeInDown'>
                {loading && <div className='text-center'>Loading...</div>}
                {errors && <div className='alert'>
                    {Object.keys(errors).map(key=> (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
                }
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input value={user.name} type='text' placeholder='Name' onChange={ev => setUser({...user, name:ev.target.value})}/>
                        <input value={user.email} type='email' placeholder='Email' onChange={ev => setUser({...user, email:ev.target.value})}/>
                        <input type='password' placeholder='Password' onChange={ev => setUser({...user, password:ev.target.value})}/>
                        <input type='password' placeholder='Password Confimration' onChange={ev => setUser({...user, password_confirmation:ev.target.value})}/>

                        <button type="submit" className='btn'>Save</button>
                    </form>
                }
            </div>
            </>
    );
}
