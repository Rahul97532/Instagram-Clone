import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import ImageUpload from "./ImageUpload";
import ScrollToTop from "./ScrollToTop";

Modal.setAppElement("#root");
function App() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState(""); // UserName of the person who wrote the post
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null); // The person who is currently signed in

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [signinModalIsOpen, setSigninModalIsOpen] = useState(false);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post_data: doc.data(),
        }))
      );
    });
  }, [posts]);

  function handleSignin(e) {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setSigninModalIsOpen(false);
    setEmail("");
    setPassword("");
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user signed in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user is logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  function handleSignup(e) {
    e.preventDefault();

    // Some sign up function
    if (password !== confirmPassword) {
      alert("Password Donot Match");
    } else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          // setUsername(username);
          console.log(username);
          return authUser.user.updateProfile({ displayName: username });
        })
        .catch((error) => alert(error.message));
    }
    setModalIsOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
  return (
    <div className="App">
      <div className="App__header">
        <img
          className="App__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
        />
        <div className="authentication">
          {user ? (
            <div className="authentication_items">
              <center>
                <span onClick={() => auth.signOut()}>Log Out</span>
              </center>
            </div>
          ) : (
            <div className="authentication_items">
              <center>
                <span
                  onClick={() => {
                    setModalIsOpen(false);
                    setSigninModalIsOpen(true);
                  }}
                >
                  Sign In
                </span>
                <span
                  onClick={() => {
                    setSigninModalIsOpen(false);
                    setModalIsOpen(true);
                  }}
                >
                  Sign Up
                </span>
              </center>
            </div>
          )}
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className="postWithoutLogin">
          <center>
            <h3>Log In to post here 😤</h3>
          </center>
        </div>
      )}
      <Modal
        className="signupModal"
        overlayClassName="Overlay"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div className="head">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram Logo"
          />
        </div>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your confirm password"
          />

          <button type="submit">Sign Up</button>
        </form>
      </Modal>
      <Modal
        className="signinModal"
        overlayClassName="Overlay"
        isOpen={signinModalIsOpen}
        onRequestClose={() => setSigninModalIsOpen(false)}
      >
        <div className="head">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram Logo"
          />
        </div>
        <form onSubmit={handleSignin}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button type="submit">Sign In</button>
        </form>
      </Modal>
      <ScrollToTop />
      <center>
        {posts.map((post) => {
          return (
            <Post
              key={post.id}
              user={user}
              postId={post.id}
              username={post.post_data.username}
              image={post.post_data.imageUrl}
              caption={post.post_data.caption}
            />
          );
        })}
      </center>
    </div>
  );
}

export default App;
