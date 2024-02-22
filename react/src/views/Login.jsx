import {Link} from "react-router-dom";

export default function Login() {
    const onSubmit = (ev) => {
        ev.preventDefault();
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Log in into your account</h1>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button type="submit" className="btn btn-block">Login</button>
                    <p className="message">
                        Dont have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
