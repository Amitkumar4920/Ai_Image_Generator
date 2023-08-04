import React from 'react';
import { Auth, Provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigator = useNavigate();

  const signIn = () => {
    signInWithPopup(Auth, Provider)
      .then(res => {
        console.log("sign in");
        navigator("/");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex flex-col items-center justify-center mb-9">
      <h1 className="text-4xl font-bold mb-8">Login Here</h1>
      <button
        onClick={signIn}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default Login;
