import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState, useEffect } from "react";
import AuthContext from '../../context/AuthProvider';

export default function ProfileImage({profilePictureKey, setProfilePictureKey}) {
  const { auth } = useContext(AuthContext);
  const userId = auth.userId;
  const [imageExists, setImageExists] = useState(false);

  // Check if the profile picture exists
  useEffect(() => {
    if (userId) {
      const profilePictureUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

      fetch(profilePictureUrl)
        .then((response) => {
          if (response.ok) {
            setImageExists(true);
          } else {
            setImageExists(false);
          }
        })
        .catch(() => {
          setImageExists(false);
        });
    }
  }, [userId]);

  // Construct the URL for the profile picture
  const profilePictureUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  return (
    <div className='profile-image-container'>
      {userId && imageExists ? (
        <img className='profile-image'     src={`${profilePictureUrl}?key=${profilePictureKey}`}  alt="Profile" />
      ) : (
        <FontAwesomeIcon className='profile-image-default' icon={faUser} />
      )}
    </div>
  );
}
