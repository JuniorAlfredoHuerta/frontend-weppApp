import React, {useEffect, useState} from 'react'

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
    </div>
  )
}

export default App