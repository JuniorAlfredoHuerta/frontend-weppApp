import React, { useRef } from "react";
import toWav from 'audiobuffer-to-wav';

const AudioRecorder = () => {
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);


  const startRecording = () => {
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
      })
      .catch((error) => {
        console.error("Error starting recording:", error);
      });
  };

  const stopRecordingAndDownload = async () => {
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

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recorded-audio.webm";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);


        // Limpiar la grabación y los chunks
        mediaRecorder.current = null;
        audioChunks.current = [];
      };
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
        onMouseDown={startRecording}
        onMouseUp={stopRecordingAndDownload}
        onTouchStart={startRecording}
        onTouchEnd={stopRecordingAndDownload}
      >
        Microfono
      </button>
    </div>
  );
};

export default AudioRecorder;