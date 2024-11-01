import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ThemeButton from './ThemeButton';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { publicAxios } from '../axios/axios';
import { removeAuth } from '../redux/reducer/authReducer';

function Header() {
    const auth = useSelector((state) => state.auth);
    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();

    const logOut = async () => {
        try {
            const res = await publicAxios.post('/user/logout');
            console.log('res:', res);
            dispatch(removeAuth());
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <Navbar expand="lg" className={`bg-body-tertiary ${theme}`}>
            <Container>
                <Link className='navbar-brand' to={'/'}>Home</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className='nav-link' to={'/news'}>News</NavLink>
                        {auth.user && auth.user.role === 'user' && <NavLink className='nav-link' to={'/user'}>User</NavLink>}
                        {auth.user && auth.user.role === 'admin' && <NavLink className='nav-link' to={'/admin'}>Admin</NavLink>}
                    </Nav>
                    <Nav>
                        {auth.user ? (
                            <NavDropdown title={auth.user.email} id="basic-nav-dropdown">
                                <button className='dropdown-item' onClick={logOut}>Logout</button>
                            </NavDropdown>
                        ) : (
                            <NavDropdown title="Account" id="basic-nav-dropdown">
                                <NavLink className='dropdown-item' to={'/login'}>Login</NavLink>
                                <NavLink className='dropdown-item' to={'/register'}>Register</NavLink>
                            </NavDropdown>
                        )}
                        <ThemeButton />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
