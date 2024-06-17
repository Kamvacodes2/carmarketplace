import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";

export default function Header() {
    const [pageState, setPageState] = useState('Sign in')
    const location = useLocation();
    const auth = getAuth();
    useEffect(()=>{
      onAuthStateChanged(auth, (user)=>{
        if(user) {
          setPageState('Profile')
        } else {
          setPageState('Sign in')
        }
      })
    }, [auth])
    const pathMatchRoute = (route) => {
        return route === location.pathname;
    }

    const navigate = useNavigate();

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
            <img src="./images/logo.png" alt="logo" className="h-20 cursor-pointer" onClick={()=> navigate('/')}></img>
        </div>
        <div>
            <ul className="flex space-x-10">
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-600 border-b-[3px] border-b-transparent ${pathMatchRoute('/') && 'text-black border-b-red-700'}`} onClick={()=> navigate('/')}>Home</li>
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-600 border-b-[3px] border-b-transparent ${pathMatchRoute('/offers') && 'text-black border-b-red-700'}`} onClick={()=> navigate('/offers')}>Offers</li>
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-600 border-b-[3px] border-b-transparent ${(pathMatchRoute('/sign-in') || pathMatchRoute('/profile')) && 'text-black border-b-red-700'}`} onClick={()=> navigate('/profile')}>{pageState}</li>
            </ul>
        </div>
      </header>
    </div>
  )
}
