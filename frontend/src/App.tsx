import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddEmergency from "./components/AddEmergency";
import AddUser from "./components/AddUser";
import Dashboard from './components/Dashboard'
import SideBar from "./common/components/sideBar";
import { ToastContainer } from "react-toastify";
import AddAmbulance from "./components/AddAmbulances";

function HiddenTailwindClasses() {
  return (
    <div className="hidden">
      <div className="bg-red-100 text-red-800"></div>
      <div className="bg-orange-100 text-orange-800"></div>
      <div className="bg-yellow-100 text-yellow-800"></div>
      <div className="bg-green-100 text-green-800"></div>
      <div className="bg-blue-100 text-blue-800"></div>
      <div className="bg-gray-100 text-gray-800"></div>
    </div>
  );
}

function App() {

  return (

    <BrowserRouter >
      <SideBar />
      <HiddenTailwindClasses />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log-emergency" element={<AddEmergency />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/update-caseDetails/:id" element={<AddEmergency />} />
        <Route path="/add-ambulance" element={<AddAmbulance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
