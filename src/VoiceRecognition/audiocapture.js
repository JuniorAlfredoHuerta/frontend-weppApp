import React, { useRef , useState} from "react";
import toWav from 'audiobuffer-to-wav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './audiocapture.css';

const AudioRecorder = () => {
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      // Detener la grabación
      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = async () => {
          const blob = new Blob(audioChunks.current, { type: "audio/webm" });
          const arrayBuffer = await blob.arrayBuffer();
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavArrayBuffer = toWav(audioBuffer);
          const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

          try {
            await sendAudioToAPI(wavBlob, 'recorded-audio.wav');
          } catch (error) {
            console.error(error);
          }

          ////DECARGA DE ARCHIVO
          //const url = URL.createObjectURL(blob);
          //const a = document.createElement("a");
          //a.href = url;
          //a.download = "recorded-audio.wav";
          //document.body.appendChild(a);
          //a.click();
          //URL.revokeObjectURL(url);
          //mediaRecorder.current = null;
          //audioChunks.current = [];
          //setIsRecording(false);
        };
      }
    } else {
      // Iniciar la grabación
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.current.push(event.data);
            }
          };
          mediaRecorder.current.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error starting recording:", error);
        });
    }
  };

  const sendAudioToAPI = async (audioBlob, fileName) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, fileName);


    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar el audio a la API');
      }
  
      const data = await response.json();
  
      // Manejar la respuesta JSON
      console.log(data); // Imprimir la respuesta JSON en la consola
  
      // Aquí puedes agregar más lógica para trabajar con los datos, por ejemplo, actualizar el estado de tu componente React
    } catch (error) {
      console.error(error);
      // Manejar errores de solicitud
    }
  };

  return (
    <div>
      <button
        className={`microphone-button ${isRecording ? "recording" : ""}`}
        onClick={toggleRecording}
      >
          <FontAwesomeIcon icon={faMicrophone} /> 
      </button>
    </div>
  );
};

export default AudioRecorder;