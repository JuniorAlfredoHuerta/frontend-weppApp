import React, { useState, useEffect } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [backendData, setBackendData] = useState({});

  useEffect(() => {
    fetch("/api")
      .then(response => response.json())
      .then(data => setBackendData(data));
  }, []);

  return (
    <div>
      {(typeof backendData.users === 'undefined') ? (
        <p> loading...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}

      <AudioRecorder />
    </div>
  );
}

export default App;
