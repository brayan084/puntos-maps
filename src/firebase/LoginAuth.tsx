import { Button } from 'primereact/button';
import { auth, googleProvider } from "./config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Login() {

  // console.trace()
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Variable de estado para controlar el estado de autenticación

  const navigate = useNavigate()


  useEffect(() => {
    if (localStorage.getItem("firebaseToken")) {
      setIsLoggedIn(true);
      navigate("/")
    }
  }, [isLoggedIn, navigate]);
  const handleLogin = async () => {
    try {
      const a = await signInWithPopup(auth, googleProvider)
      console.log(a.user)
      // localStorage.setItem("firebaseToken", a._tokenResponse.idToken)
      localStorage.setItem("firebaseToken", await a.user?.getIdToken())
      localStorage.setItem("user", JSON.stringify(a.user))
      window.location.reload();
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Establecer el estado de autenticación cuando el usuario cierre sesión
    // Otro código necesario para cerrar sesión si es necesario
    window.location.reload();
  };

  if (isLoggedIn) {
    return (
      <div className='flex justify-content-start'>
        <div className='card flex justify-content-center'>
          <Button onClick={handleLogout} icon='pi pi-google' label='Cerrar sesión' className='p-button-rounded' severity='danger'  /> {/* Botón para cerrar sesión */}
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-content-start' >
      <div className='card flex justify-content-center'>
        <Button onClick={handleLogin} icon='pi pi-google' className='p-button-rounded' severity='success' label='Iniciar sesión con Google'   />
      </div>
    </div>
  );
}