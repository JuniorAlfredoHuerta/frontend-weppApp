import React, {useEffect, useState} from 'react'
<<<<<<< Updated upstream
=======
import Dictaphone  from './components/add.js';
import AudioRecorder from './components/AudioRecorder.js';
import VoiceRecorder from './VoiceRecognition/audiocapture.js';
>>>>>>> Stashed changes

function App() {

  const [backenData, setBackendData] = useState(({}))

  /*useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)},
    )
  
  }, [])
  */


  return (
    <div>
      {(typeof backenData.users === 'undefined') ? (
      <p> loading...</p>):(
        backenData.users.map((user,i) => (
          <p key= {i}>{user}</p>
        ))
      )}
<<<<<<< Updated upstream
=======

      <h1>Reconocimiento de Voz en App</h1>
      <Dictaphone />
    
      <div>
      <VoiceRecorder />
      </div>
>>>>>>> Stashed changes
    </div>
  )
}

export default App