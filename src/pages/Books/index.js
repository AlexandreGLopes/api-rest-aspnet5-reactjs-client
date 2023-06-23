import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPower, FiEdit, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoimage from '../../assets/logo.svg';

export default function Books() {

    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0);

    const userName = localStorage.getItem('userName');
    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchMoreBooks();

        //Monitorando a accessToken abaixo. Sempre que ela mudar o useEffect vai ter que ser chamado de novo para recarregar a lista
    }, [accessToken]);

    async function fetchMoreBooks() {
        const response = await api.get(`api/Book/v1/asc/4/${page}`, authorization)
            .then(response => {
                setBooks([...books, ...response.data.list]);
                setPage(page + 1);
            });
    }

    async function deleteBook(id) {
        try {
            await api.delete(`api/Book/v1/${id}`, authorization);

            setBooks(books.filter(book => book.id != id));
        } catch (error) {
            alert('Delete failed! Try again! ' + error);
        }
    }

    async function editBook(id) {
        try {
            navigate(`/book/new/${id}`)
        } catch (error) {
            alert('Edit Book failed! Try again! ' + error);
        }
    }

    async function logout() {
        try {
            await api.get('api/auth/v1/revoke', authorization);

            localStorage.clear();
            navigate('/');
        } catch (error) {
            alert('Logout failed! ' + error);
        }
    }

    return (
        <div className='book-container'>
            <header>
                <img src={logoimage} alt='logo Alexandre' />
                <span>Welcome, <strong>{userName.toUpperCase()}</strong></span>
                <Link className='button' to="/book/new/0">Add New Book</Link>
                {/* No onClick do button abaixo não precisa de Arrow Function para evitar loop.
                Porque não tem parâmetro na chamada da função */}
                <button onClick={logout} type='button'>
                    <FiPower size={18} color='#251FC5' />
                </button>
            </header>

            <h1>Registered Books</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>Title:</strong>
                        <p>{book.title}</p>
                        <strong>Author:</strong>
                        <p>{book.author}</p>
                        <strong>Price:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(book.price)}</p>
                        <strong>Release date:</strong>
                        <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launchDate))}</p>
    
                        {/* No onClick do botão não podemos chamar a função sem a Arrow Function. 
                        Se fizermos isso, a função será chamada em loop e assim carregar várias telas de books.
                        A Arrow Function previne esse comportamento */}
                        <button onClick={() => editBook(book.id)} type='button'>
                            <FiEdit size={20} color='#251FC5' />
                        </button>
    
                        {/* No onClick do botão não podemos chamar a função sem a Arrow Function. 
                        Se fizermos isso, a função será chamada em loop assim que carregar a tela e a base toda será excluída.
                        A Arrow Function previne esse comportamento */}
                        <button onClick={() => deleteBook(book.id)} type='button'>
                            <FiTrash2 size={20} color='#251FC5' />
                        </button>
                    </li>
                ))}
            </ul>
            <button className="button" onClick={fetchMoreBooks} type='button'>Load More</button>
        </div>
    );
}