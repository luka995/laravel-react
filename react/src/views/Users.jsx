import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import SearchUserInput from "./SearchUserInput.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Users() {

    const [users, setUsers] = useState([]);
    const [metaPagination, setMetaPagination] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm); // Postavljanje searchTerm na novu vrednost
        getUsers(searchTerm, currentPage); // Pozivanje getUsers sa prvom stranicom i novom vrednošću searchTerm-a
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        getUsers(searchTerm, value); // Pozivamo getUsers sa trenutnom stranicom i terminom pretrage
    };


    useEffect(()=>{
        getUsers();
    }, []);

    const getUsers = (searchTerm, page) => {

        setLoading(true);
        axiosClient.get(`/users?search=${searchTerm || ''}&page=${page || ''}`)
            .then(({data}) => {
                setUsers(data.data);
                setMetaPagination(data.meta);
                setLoading(false);
                console.log(data);
            })
            .catch(() => {
                setLoading(false);
            })
    };

    const onDelete = (u) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                setNotification('User successfully created');
                getUsers();
            });
    }

    return (
        <div>
            <div style={{display:'flex', justifyContent: 'space-between', alignItems:'center'}}>
                <h1>Users</h1>
                <SearchUserInput searchTerm={searchTerm} onSearch={handleSearch} />
                <Link to="/users/new" className='btn-add'>Add new</Link>
            </div>
            <div className='card animated fadeInDown'>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    {loading && <tbody>
                        <tr>
                            <td colSpan='5' className='text-center'>Loading...</td>
                        </tr>
                    </tbody>}
                    {!loading &&<tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.created_at}</td>
                            <td>
                                <Link to={'/users/'+ u.id} className='btn-edit'>Edit</Link>
                                &nbsp;
                                <button onClick={ev=> onDelete(u)} className='btn-delete'>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    }
                </table>
                <Stack spacing={2} style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination count={metaPagination.last_page} page={currentPage} onChange={handlePageChange} />
                </Stack>
            </div>
        </div>
    )
}
