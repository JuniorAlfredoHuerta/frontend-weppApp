import React from 'react'
//import Dictaphone  from './components/add.js';
import MainMenu from './components/MainMenu';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from 'react-router-dom';
import AgregarProducto from './components/AddProducto/AddProducto';
function App() {


  //const [backenData, setBackendData] = useState(({}))

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
    <Router>
    <div>
      {/*{(typeof backenData.users === 'undefined') ? (
      <p> loading...</p>):(
        backenData.users.map((user,i) => (
          <p key= {i}>{user}</p>
        ))
        )}*/}
    </div>
    <Routes>
        <Route exact path="/mainmenu" Component={MainMenu}/>
        <Route exact path="/agregar" Component={AgregarProducto}/>
    </Routes>
        
    </Router>
    
  )
}

export default App