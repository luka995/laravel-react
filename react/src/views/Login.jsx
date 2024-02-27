import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const [errors, setErrors] = useState(null);
    const {setToken, setUser} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password : passwordRef.current.value,
        }
        //data is destructure from response obj, so this is why data is written inside {} - data is actual json obj
        //user info and token info
        //TODO update state context information of user and token when received from server response
        axiosClient.post('/login', payload)
            .then(({data}) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                const response = err.response;
                //validation error
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    }
                    //bad, contructin same object as errors if errors does not exist - propably message exist
                    else {
                        setErrors({
                            email: [response.data.message]
                        });
                    }

                }
            })

    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Log in into your account</h1>
                    {errors && <div className='alert'>
                        {Object.keys(errors).map(key=> (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>

                    }
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Password"/>
                    <button type="submit" className="btn btn-block">Login</button>
                    <p className="message">
                        Dont have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
