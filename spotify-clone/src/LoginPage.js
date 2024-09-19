import React from 'react';

const LoginPage = ({ signInWithGoogle }) => {
  return (
    <div className="login-container">
      <button onClick={signInWithGoogle} className="signin-button">
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
