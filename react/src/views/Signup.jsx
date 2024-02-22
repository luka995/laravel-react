import {Link} from "react-router-dom";
import {useRef} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passfordConfirmationRef = useRef();

    const {setToken, setUser} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password : passwordRef.current.value,
            //camelCase because of laravel
            passford_confirmation: passfordConfirmationRef.current.value
        }
        //data is destructure from response obj, so this is why data is written inside {} - data is actual json obj
        //user info and token info
        //TODO update state context information of user and token when received from server response
        axiosClient.post('/signup', payload)
            .then(({data}) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                const response = err.response;
                //validation error
                if (response && response === 422) {
                    console.log(response.data.errors);
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Sign up</h1>
                    <input ref={nameRef} type="text" placeholder="Full name"/>
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Password"/>
                    <input ref={passfordConfirmationRef} type="password" placeholder="Password again"/>
                    <button type="submit" className="btn btn-block">Signup</button>
                    <p className="message">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
