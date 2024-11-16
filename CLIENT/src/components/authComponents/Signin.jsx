import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';

import axios from '../../api/axios';
const SIGNIN_URL = '/auth';

const Signin = () => {
    const { setAuth } = useAuth();
// console.log("setAUth", setAuth)
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, /*userAttribs*/] = useInput('user', '')



    const [pwd, setPwd] = useState('Password1!');
    const [email, setEmail] = useState('@example.com');
    let trimmedEmail = email.trim().toLowerCase();
    // console.log("trimmedEmail", trimmedEmail)
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleClose = () => navigate('/');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(SIGNIN_URL,
                JSON.stringify({ user, pwd, trimmedEmail }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            //  console.log("response data", response.data)
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.userId;
            const roles = response?.data?.roles;
            
// console.log("Login js user id", userId)

            setAuth({ userId, user, email, roles, accessToken });
            resetUser();
            // resetEmail();
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Username or password are wrong or missing');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="overlay-component">
    <button className="close-button" onClick={handleClose}>✖</button>
        <section className="centered-section">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="signup-title">Sign In</div>
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Email Input */}
            <label htmlFor="email">
              Email:
              {/* FontAwesome Icons for validation could be added here */}
            </label>
            <input
            className='input-field'
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
  
            {/* Password Input */}
            <label htmlFor="password">
              Password:
              {/* FontAwesome Icons for validation could be added here */}
            </label>
            <input
                className='input-field'
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            
            {/* Submit Button */}
            <button className='button-auth'>Sign In</button>
  
            {/* "Trust This Device" Checkbox */}
            <div className="trust-device">
              <input
                type="checkbox"
                id="persist"
                onChange={toggleCheck}
                checked={check}
              />
              <label htmlFor="persist">Trust This Device</label>
            </div>
          </form>
          <p className='have-an-account'>
            <p>Need an Account?</p>
            <p>
              <Link to="/signup">Sign Up</Link>
            </p>
          </p>
          <p className='have-an-account'>
            Forgot password?<br />
            <p>
              <Link to="/resetpassword">Reset</Link>
            </p>
          </p>
        </section>
      </div>

    )
}

export default Signin
