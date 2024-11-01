import { useSelector, useDispatch } from 'react-redux';
const UserPage = () => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    return (
        <div>
            <h1>User Page</h1>
            <h2>Welcome {auth.user.name}</h2>
        </div>
    );
};

export default UserPage;