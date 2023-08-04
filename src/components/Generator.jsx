import React, { useState } from "react";
import Api from "./api";
import "./ImageGenerationForm.css";
import { CircularProgress } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuthState } from "react-firebase-hooks/auth";
import { Auth, db, storage } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const ImageGenerationForm = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { user } = useAuthState(Auth);
  const postRef = collection(db, "post");

  const uploadImage = async () =>{
    if(imageFile !== null){
      const imageRef = ref(storage, `images/${imageFile.name + v4()}`)
      uploadBytes(imageRef, imageFile)
      .then(()=>{
        getDownloadURL(imageRef)
        .then((url)=>{
          if(prompt !== ""){
            addDoc(postRef, {
              prompt: prompt,
              image: url,
              user: user.displayName,
              logo: user.photoURL,
            })
            .then(res=>alert("posted"))
            .catch(err=>console.log(err))
          }
        })
      })
      .catch(err=>console.log(err))
    }

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const input = event.target.elements.input.value;
    setPrompt(input);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Api}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const blob = await response.blob();
    setOutput(URL.createObjectURL(blob));
    setImageFile(new File([blob], "generated_image.png", { type: "image/png" }));
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = output;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };

  return (
    <div className="container imageGen al-c mt-3">
     
      <p className="des">
      Write the  description of image you want to generate
      </p>
      <form className="generate-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="input"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>
      <div>
        {loading && (
          <div className="loading">
            <p>
              <CircularProgress />
            </p>
          </div>
        )}
        {!loading && output && (
          <div className="result-image">
            <img src={output} alt="art" />
            <div>
              <button onClick={handleDownload}>
                <DownloadIcon />
              </button>
              {user && (
                <button onClick={uploadImage}>
                  <ShareIcon />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerationForm;
