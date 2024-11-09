import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useLocation, useNavigate, matchPath } from "react-router-dom";
import { useAxios } from './axios/axios';
import { setAuth } from './redux/reducer/authReducer';
import { removeAuth } from "./redux/reducer/authReducer";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { socket } from "./socket";
import { ThemeProvider, createTheme } from '@mui/material/styles';
const App = () => {
	const { privateAxios } = useAxios();
	const [loading, setLoading] = useState(true);
	const auth = useSelector((state) => state.auth);
	const themeStore = useSelector((state) => state.theme.theme);
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const getUser = async () => {
		try {
			const response = await privateAxios.get('/user');
			dispatch(setAuth({ "user": response.data }));
			localStorage.setItem('isAuth', true);
		} catch (error) {
			localStorage.setItem('isAuth', false);
		}
		finally {
			setLoading(false);
		}
	};

	const handleStorageChange = (event) => {
		if (event.key === 'isAuth') {
			const isAuth = JSON.parse(event.newValue);
			console.log("LocalStorage is Auth: ", isAuth);
			if (!isAuth) {
				dispatch(removeAuth());
			} else {
				getUser();
			}
		}
	};

	useEffect(() => {
		socket.connect();
		socket.on('message', (data) => {
			console.log('Message from server:', data.message);
		});
		window.addEventListener('storage', handleStorageChange);
		getUser();
		return () => {
			window.removeEventListener('storage', handleStorageChange);
			socket.disconnect();
		};
	}, []);

	const theme = createTheme({
		palette: {
			mode: themeStore,
		},
	});


	if (loading) return <></>;
	const pathHide = ['/login', '/register', '/confirm', '/forgot-password', '/reset-password', '/confirm/:token'];
	const hideHeaderFooter = pathHide.some(path => matchPath(path, location.pathname));
	if (hideHeaderFooter) {
		return (
			<>
				<Outlet />
			</>
		);
	}

	return (
		<>
			<ThemeProvider theme={theme}>
				<Header />
				<div className='vh-100'>
					<Outlet />
				</div>
				<Footer />
			</ThemeProvider>
		</>
	);
};

export default App;