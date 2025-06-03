import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddEmergency from "./components/AddEmergency";
import SideBar from "./common/components/sideBar";
import AddUser from "./components/AddUser";
import { ToastContainer } from "react-toastify";


function App() {

  return (
    
      <BrowserRouter >
        <SideBar />
        <ToastContainer/>
        <Routes>
          <Route path="/log-emergency" element={<AddEmergency />} />
          <Route path="/add-user" element={<AddUser />}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
