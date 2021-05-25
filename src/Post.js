import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";

function Post(props) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (props.postId) {
      unsubscribe = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  function handleComment(e) {
    e.preventDefault();
    db.collection("posts").doc(props.postId).collection("comments").add({
      text: commentInput,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setCommentInput("");
  }

  return (
    <div className="Post">
      <div className="Post__header">
        <Avatar
          className="Post__avatar"
          alt={props.username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{props.username}</h3>
      </div>

      <img className="Post__Image" src={props.image} alt="Image" />
      <h4 className="Post__UserCaption">
        <strong>{props.username}:</strong> {props.caption}
      </h4>

      <div className="post__comments">
        {comments.map((curr_comment) => (
          <p>
            <strong>{curr_comment.username}</strong> {curr_comment.text}
          </p>
        ))}
      </div>

      {props.user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            className="post__button"
            type="submit"
            onClick={handleComment}
            disabled={!commentInput}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
