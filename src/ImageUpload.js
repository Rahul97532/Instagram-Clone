import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "./firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  function handleChange(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  function handleUpload() {
    if (caption === "" || image == null) {
      // If condition applied so that our app donot break
      alert("OOPS! Image or caption not added.");
      return;
    }
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const curr_progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(curr_progress);
      },
      (error) => {
        //Error function
        console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              caption: caption,
              imageUrl: url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              username: username,
            });
          });
        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  }

  return (
    <div className="ImageUpload">
      <progress className="image_upload_progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}> Upload </button>
    </div>
  );
}

export default ImageUpload;
