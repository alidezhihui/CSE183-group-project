import React from 'react';
import { useHistory } from "react-router-dom";
import './Login.css';
import api from './utils/api'

function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useHistory();

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
    console.log(u);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try{
      const data = await api.post('/authenticate',user);
      localStorage.setItem('user', JSON.stringify(data));
      history.push('/home')
    } catch(e){
      console.log(e)
      alert('Error logging in, please try again');
    }
  }

  return (
    <div className = 'formContainerV'>
    <form className = 'form' onSubmit={onSubmit}>
      <h2 id='welcome'>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Username"
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleInputChange}
        required
      />
      <div className = 'Button'>
        <label>
          <input type='checkbox'/>
          remember me
        </label>
        <input className = 'submit' type="submit" value="Sign in"/>
      </div>
    </form>
    </div>
  );
}

export default Login;
