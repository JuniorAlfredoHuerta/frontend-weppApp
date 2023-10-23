import React, {useEffect, useState} from 'react'
import Dictaphone  from './components/add.js';
import AudioRecorder from './components/AudioRecorder.js';

function App() {

  const [backenData, setBackendData] = useState(({}))

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)},
    )
  
  }, [])
  


  return (
    
    



    <div>
      {(typeof backenData.users === 'undefined') ? (
      <p> loading...</p>):(
        backenData.users.map((user,i) => (
          <p key= {i}>{user}</p>
        ))
      )}

      <h1>Reconocimiento de Voz en App</h1>
      <Dictaphone /> {/* Aquí estás utilizando el componente Dictaphone */}
    
      <div>
      <AudioRecorder />
      </div>
    </div>
  )
}

export default App