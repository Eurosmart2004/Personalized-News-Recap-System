import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { privateAxios } from './axios/axios';
import { setAuth } from './redux/reducer/authReducer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const App = () => {
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
		} catch (error) {

		}
		finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	const theme = createTheme({
		palette: {
			mode: themeStore,
		},
	});


	if (loading) return <></>;

	const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register';
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