import {createContext,useState,useEffect,ReactNode} from 'react'
import {jwtDecode} from "jwt-decode"
import { useNavigate } from 'react-router-dom';

interface AuthContextType{
    user:User|null;
    authTokens:AuthTokens|null;
    loginUser:(event:React.FormEvent<HTMLFormElement>)=>Promise<void>;
    logoutUser:()=>void;
}
interface AuthTokens{
    access:string;
    refresh:string;
}
interface User{
    username:string;
}
interface AuthProviderProps{
    children:ReactNode;
}

const AuthContext=createContext<AuthContextType|undefined>(undefined)
export default AuthContext;


export const AuthProvider:React.FC<AuthProviderProps>= ({children}) => {
    const [authTokens,setAuthTokens]=useState<AuthTokens|null>(()=>{
        const storedTokens=localStorage.getItem('authTokens');
        return storedTokens?JSON.parse(storedTokens):null;
    });

    const [user,setUser]=useState<User|null>(()=>{
        const storedTokens=localStorage.getItem('authTokens');
        return storedTokens?jwtDecode(storedTokens):null;
    });
    const [loading,setLoading]=useState(true);


    const navigate=useNavigate();
    const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if(response.status===200){
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens',JSON.stringify(data));
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }
    const logoutUser= () =>{
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    }

    let updateToken = async ()=>{
        console.log("Update token called");
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        });
        const data = await response.json();
        if(response.status===200){
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens',JSON.stringify(data));
        }else{
            logoutUser();
        }
        if(loading){
            setLoading(false);
        }
    }

    let contextData:AuthContextType={
        user,
        authTokens,
        loginUser,
        logoutUser
    }
    
    useEffect(()=>{
        if(loading){
            updateToken();
        }
        let oneDay:number=1000*60*60*23;
        let interval:number=setInterval(()=>{
            if(authTokens){
                updateToken();
            }
        },oneDay)
        return ()=>clearInterval(interval);
    },[authTokens,loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading?null:children}
        </AuthContext.Provider>
    )
}   