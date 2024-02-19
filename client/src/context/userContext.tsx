import axios from "axios";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface User {
    email: string;
};

interface UserAuth {
    user: User | null;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserAuth | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const verifyUser = async () => {
        try {
            const { data } = await axios.get("api/user/auth-status");

            setUser({ email: data.email });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        verifyUser();
    }, []);

    return <UserContext.Provider value={{ user, refreshUser: verifyUser }}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => useContext(UserContext);
