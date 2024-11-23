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
import { setTheme } from "./redux/reducer/themeReducer";
import './styles/App.css';
import HomePage from "./pages/HomePage";
const App = () => {
	const { privateAxios } = useAxios();
	const [loading, setLoading] = useState(true);
	const auth = useSelector((state) => state.auth);
	const themeStore = useSelector((state) => state.theme.theme);
	const [expanded, setExpanded] = useState(true); // Sidebar expanded state
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getUser = async () => {
		try {
			setLoading(true);
			const response = await privateAxios.get('/user');
			console.log(response);
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
			if (isAuth !== 'true') {
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
		const savedTheme = localStorage.getItem('theme') || 'auto';
		dispatch(setTheme(savedTheme));

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			socket.disconnect();
		};
	}, []);

	const theme = createTheme({
		palette: {
			mode: themeStore === 'auto' ? 'light' : themeStore,
		},
	});


	if (loading) return <></>;
	const pathHide = ['/login', '/register', '/preference', '/require-confirm', '/forgot-password', '/reset-password/:token', '/confirm/:token'];
	const hideHeaderFooter = pathHide.some(path => matchPath(path, location.pathname));
	if (hideHeaderFooter) {
		return (
			<>
				<Outlet />
			</>
		);
	}

	// if (!auth.user) {
	// 	return <>
	// 		<HomePage />
	// 	</>;
	// }

	return (
		<>
			<ThemeProvider theme={theme}>
				<div className="flex">
					<Header expanded={expanded} setExpanded={setExpanded} />
					<main className={`transition-all dark:bg-black ml-0 ${expanded ? "sm:ml-[250px]" : "sm:ml-[100px]"} lg:p-20`}>
						<Outlet />
					</main>
				</div>
				<div className={`transition-all dark:bg-black ml-0 ${expanded ? "sm:ml-[250px]" : "sm:ml-[100px]"}`}>
					<Footer />
				</div>

			</ThemeProvider>
		</>
	);
};

export default App;