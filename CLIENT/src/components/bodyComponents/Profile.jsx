import { useState, useEffect } from "react";
import useAuth from "../../../src/hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../../css/Profile.css';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

const profilePictureExists = async (userId) => {

  const imageUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false;
  }
};

const validateInput = (editMode, value, confirmPwd = "") => {
  let regex, errorMessage;

  if (editMode === "username") {
    regex = /^[a-zA-Z][a-zA-Z0-9_-]{3,23}$/;
    errorMessage = "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.";
  } else if (editMode === "email") {
    regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    errorMessage = "Must be a valid email address. Special characters allowed: . - _";
  } else if (editMode === "password") {
    regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,24}$/;
    errorMessage = "8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character. Allowed: !@#$%^&*.";
  } else if (editMode === "matchPwd") {
    if (!value || !confirmPwd) {
      errorMessage = "Both password fields must be filled.";
      return { valid: false, message: errorMessage };
    }
    if (value !== confirmPwd) {
      errorMessage = "Passwords must match.";
      return { valid: false, message: errorMessage };
    }
    const regexValidation = validateInput("password", value);
    if (!regexValidation.valid) {
      return { valid: false, message: regexValidation.message };
    }
    return { valid: true };
  }


  if (regex && !regex.test(value)) {
    return { valid: false, message: errorMessage };
  }

  return { valid: true };
};

export default function Profile() {
  const { auth } = useAuth();
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [imageExists, setImageExists] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  const userId = auth.userId || "Guest";
  const userEmail = auth.email || "example@example.com";

  useEffect(() => {
    const checkImage = async () => {
      const exists = await profilePictureExists(userId);
      setImageExists(exists);
    };
    checkImage();
  }, [userId]);

  const profilePictureUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  const handlePictureClick = () => {
    setError(""); // Hide any error message
    setInputValue("");
    setConfirmPwd("");
    setIsPictureModalVisible(true);
  };

  const handleDeleteClick = () => {
    setError(""); // Hide any error message
    if (showConfirmDelete) {
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const handleConfirmDelete = () => {
    console.log("Account deleted");
  };

  const placeholderText = {
    username: "Enter new username",
    email: "Enter new email",
    password: "Enter new password",
    matchPwd: "Confirm new password",
  }[editMode];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  
    if (editMode === "password") {
      const regexValidation = validateInput("password", value);
      const matchValidation = validateInput("matchPwd", value, confirmPwd);
  
      setIsInputValid(regexValidation.valid && matchValidation.valid);
      setError(regexValidation.valid ? matchValidation.message : regexValidation.message);
    } else if (editMode) {
      const validation = validateInput(editMode, value);
      setIsInputValid(validation.valid);
      setError(validation.valid ? "" : validation.message);
    }
  };
  
  const handleConfirmPwdChange = (e) => {
    const value = e.target.value;
    setConfirmPwd(value);
  
    if (editMode === "password") {
      const matchValidation = validateInput("matchPwd", inputValue, value);
      setIsInputValid(matchValidation.valid);
      setError(matchValidation.valid ? "" : matchValidation.message);
    }
  };
  

  const handleUpdate = async () => {
    const validation = validateInput(editMode, inputValue, confirmPwd);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    const payload = {
      userId,
      [editMode]: inputValue,
    };

    setTimeout(() => {
      const simulatedResponse = {
        success: true,
        message: 'Update successful',
      };

      if (simulatedResponse.success) {
        console.log('Update successful');
        setInputValue('');
        setConfirmPwd('');
        setEditMode(null);
      } else {
        console.error('Update failed:', simulatedResponse.message);
      }

      setIsLoading(false);
    }, 2000);
  };

  const handleEditButtonClick = (type) => {
    setError("");
    setInputValue("");
    setConfirmPwd("");
    if (editMode === type) {
      setEditMode(null);
    } else {
      setShowConfirmDelete(false);
      setEditMode(type);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };


  return (
    <div className="body-overlay-component">
      <div className="profile-container">
        <h2>{userId}</h2>
        <div className="profile-details">
          <div className="profile-picture" onClick={handlePictureClick}>
            {imageExists ? (
              <img src={profilePictureUrl} alt="Profile" />
            ) : (
              <FontAwesomeIcon icon={faUser} size="6x" />
            )}
          </div>
          {isPictureModalVisible && (
            <div className="picture-modal">
              <h3>Change your profile picture</h3>
              <input type="file" />
              <button onClick={() => setIsPictureModalVisible(false)}>Close</button>
            </div>
          )}
          <div className="profile-info">
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button
            className="profile-actions-button button-white"
            onClick={() => handleEditButtonClick("username")}
            disabled={editMode === "username" && !isInputValid} // Disable if regex fails
          >
            Edit Username
          </button>
          <button
            className="profile-actions-button button-white"
            onClick={() => handleEditButtonClick("email")}
            disabled={editMode === "email" && !isInputValid} // Disable if regex fails
          >
            Edit Email
          </button>
          <button
            className="profile-actions-button button-white"
            onClick={() => handleEditButtonClick("password")}
          >
            Edit Password
          </button>

          <button
            className="profile-actions-button button-red"
            onClick={handleDeleteClick}
          >
            Delete Account
          </button>
          {showConfirmDelete &&
            <div className="delete-confirmation">
              <p>Are you sure you want to delete your account? This action is permanent and cannot be undone.</p>
              <button
                className="button-white"
                onClick={() => setShowConfirmDelete(false)}
              >
                Keep account
              </button>
              <button
                className="button-red"
                onClick={handleConfirmDelete}
              >
                Delete account
              </button>
            </div>
          }
        </div>
        <div className="update-input">
  {!isLoading && editMode && !showConfirmDelete && (
    <>
      {/* For editing username or email */}
      {(editMode === "username" || editMode === "email") && (
        <div className="edit-input-container">
          <input
            type="text"
            placeholder={placeholderText} // Dynamic placeholder
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* For password edit mode */}
      {editMode === "password" && (
        <>
          {/* Enter new password field with visibility toggle */}
          <div className="password-container">
            <input
              type={isNewPasswordVisible ? "text" : "password"}
              placeholder={placeholderText}
              value={inputValue}
              onChange={handleInputChange}
            />
            <FontAwesomeIcon
              icon={isNewPasswordVisible ? faEyeSlash : faEye}
              onClick={toggleNewPasswordVisibility}
              className="toggle-password-icon"
            />
          </div>

          {/* Confirm new password field with visibility toggle */}
          <div className="password-container">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPwd}
              onChange={handleConfirmPwdChange}
            />
            <FontAwesomeIcon
              icon={isConfirmPasswordVisible ? faEyeSlash : faEye}
              onClick={toggleConfirmPasswordVisibility}
              className="toggle-password-icon"
            />
          </div>
        </>
      )}

      {/* Error message */}
      {error && <div className="profile-input-instructions">{error}</div>}

      {/* Update button */}
      <button
  onClick={handleUpdate}
  className="button-white"
  disabled={!isInputValid || inputValue.trim() === ""}
>
  Update
</button>


    </>
  )}

  {isLoading && <LoadingSpinner />}
</div>


      </div>
    </div>
  );
}
