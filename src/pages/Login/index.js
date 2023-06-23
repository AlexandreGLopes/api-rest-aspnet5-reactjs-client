import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api'

import './styles.css';

import logoimage from '../../assets/logo.svg'
import padlock from '../../assets/padlock.png'

export default function Login() {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // para garantir que a função seja executada com sucesso vamos torná-la assícrona. Porque ele pode passar direto pela chamada a api.
    async function login(e) {
        // e.preventDefault() prevenir o refresh da pagina na ação de submit
        e.preventDefault();

        const data = {
            userName,
            password,
        };

        try {
            // para garantir que a função seja executada com sucesso vamos torná-la assícrona. Porque ele pode passar direto pela chamada a api.
            const response = await api.post('api/auth/v1/signin', data);

            localStorage.setItem('userName', userName);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            navigate('/books');
        } catch (error) {
            alert('Login failed! Try again! ' + error);
        }
    }

    return (
        <div className="login-container">
            <section className="form">
                <img src={logoimage} alt="Alexandre Logo"/>
                <form onSubmit={login}>
                    <h1>Access your account</h1>

                    <input 
                        placeholder='Username'
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                    />

                    <input 
                        type='password' 
                        placeholder='Password' 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button className='button' type='submit'>Login</button>
                </form>
            </section>

            <img src={padlock} alt="Login"/>
        </div>
    );
}