import { UserContext } from "./UserContext";
import { useSecureState } from '../../hooks/useSecureState.js';

export default function UserProvider({
    children,
}) {
    const [state, setState] = useSecureState('user', null);

    const loginHandler = async (user, accessToken) => {
        const newState = {
            ...user,
            accessToken,
        };

        await setState(newState);
    };

    const logout = () => {
        setState(null);
    };

    const contextData = {
        isAuthenticated: !!state,
        user: state,
        login: loginHandler,
        logout,
    };

    return (
        <UserContext.Provider value={contextData}>
            {children}
        </UserContext.Provider>
    );
}
