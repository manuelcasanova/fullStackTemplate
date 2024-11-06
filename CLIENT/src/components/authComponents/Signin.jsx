import '../../css/Overlay.css'

import { useNavigate } from 'react-router-dom';

export default function Signin () {
  const navigate = useNavigate();

  const handleClose = () => {
      navigate('/'); 
  };

  return (
    <div className="overlay-component">
      <div className='centered-section'>
      <button className="close-button" onClick={handleClose}>
          ✖
        </button>
        Sign In
        </div>
    </div>
  )
}