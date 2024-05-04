import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMicrophone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./audiocapture.css";
import { Link } from "react-router-dom";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

const AudioRecorder = ({ onApiResponse }) => {
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [encoderRegistered, setEncoderRegistered] = useState(false);
  useEffect(() => {
    const initializeEncoder = async () => {
      if (!encoderRegistered) {
        try {
          const encoder = await connect();
          await register(encoder);
          setEncoderRegistered(true);
        } catch (error) {}
      }
    };

    initializeEncoder();

    return () => {};
  }, [encoderRegistered]);

  const toggleRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/wav",
      });
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } else {
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: "audio/wav" });
        try {
          await sendAudioToAPI(blob, "recorded-audio.wav");
        } catch (error) {
          console.error(error);
        }
        mediaRecorder.current = null;
        audioChunks.current = [];
        setIsRecording(false);
      };
    }
  };

  const sendAudioToAPI = async (audioBlob, fileName) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, fileName);

    try {
      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al enviar el audio a la API");
      }

      const data = await response.json();
      console.log(data);
      onApiResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-with-blue-background">
      <button
        className={`microphone-button ${isRecording ? "recording" : ""}`}
        onClick={toggleRecording}
      >
        <FontAwesomeIcon icon={faMicrophone} />
      </button>
      <Link to="/mainmenu">
        <button className="home-button">
          <FontAwesomeIcon icon={faHome} />
        </button>
      </Link>
      <Link to="/user">
        <button className="user-button">
          <FontAwesomeIcon icon={faUser} />
        </button>
      </Link>
    </div>
  );
};
export default AudioRecorder;
