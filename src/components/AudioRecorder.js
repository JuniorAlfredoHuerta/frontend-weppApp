
import React, { useState } from 'react';

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  let mediaRecorder;

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks([...audioChunks, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioUrl(URL.createObjectURL(audioBlob));
          setAudioChunks([]);
        };

        mediaRecorder.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error('Error al acceder al micrófono:', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div>
      <h2>Grabación de Audio</h2>
      <button onClick={startRecording} disabled={recording}>
        Iniciar Grabación
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Detener Grabación
      </button>
      {audioUrl && <audio controls src={audioUrl}></audio>}
    </div>
  );
}

export default AudioRecorder;
