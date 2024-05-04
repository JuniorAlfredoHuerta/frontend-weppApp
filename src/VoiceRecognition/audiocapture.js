import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMicrophone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./audiocapture.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const AudioRecorder = ({ onApiResponse }) => {
  const recognition = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef("");
  const [canRecord, setCanRecord] = useState(false);

  useEffect(() => {
    if (!Cookies.get("tokenbodega")) {
      setCanRecord(false);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setCanRecord(true);
      })
      .catch((error) => {
        console.error("Error al acceder al micrófono:", error);
        setCanRecord(false);
      });
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = false;

    recognition.current.onstart = () => {
      setIsRecording(true);
    };

    recognition.current.onend = () => {
      setIsRecording(false);
      console.log(transcriptRef.current);
      sendTranscriptToAPI(transcriptRef.current); // Usa el valor actual de transcriptRef
    };

    recognition.current.onresult = (event) => {
      const result = event.results[0][0];
      const transcript = result.transcript;
      transcriptRef.current = transcript; // Actualiza el valor de transcriptRef
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);
  const sendTranscriptToAPI = async (transcript) => {
    const formData = new FormData();
    formData.append("transcript", transcript);

    try {
      const response = await fetch(
        "https://api-app-n3qk.onrender.com/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la transcripción a la API");
      }

      const data = await response.json();
      console.log(data);
      onApiResponse(data);
    } catch (error) {
      //console.error(error);
    }
  };

  const toggleRecording = () => {
    if (!isRecording && canRecord) {
      recognition.current.start();
    } else {
      recognition.current.stop();
    }
  };
  return (
    <div className="container-with-blue-background">
      <button
        className={`microphone-button ${isRecording ? "recording" : ""} ${
          !canRecord ? "disabled" : ""
        }`}
        onClick={toggleRecording}
        disabled={!canRecord}
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
