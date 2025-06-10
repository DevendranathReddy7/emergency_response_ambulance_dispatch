import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AddEmergency from "./components/AddEmergency";
import AddUser from "./components/User";
import Dashboard from './components/Dashboard'
import SideBar from "./common/components/sideBar";
import { ToastContainer } from "react-toastify";
import AddAmbulance from "./components/AddAmbulances";
import UsersList from "./components/User/UserList";
import ViewAmbulances from "./components/AddAmbulances/ViewAmbulances";
import Login from "./components/Login";
import NotFound from "./common/components/NotFound";
import { useMemo } from 'react';
import { Provider } from "react-redux";
import { store } from "./store/store";


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

const ShowRoutes = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/login';

  const hasAccess = useMemo(() => {
    return !!localStorage.getItem('authToken');
  }, []);

  return (
    <>
      {showSidebar && <SideBar />}
      <HiddenTailwindClasses />
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={hasAccess ? <Dashboard /> : <NotFound />} />
        <Route path="/log-emergency" element={hasAccess ? <AddEmergency /> : <NotFound />} />
        <Route path="/add-user" element={hasAccess ? <AddUser /> : <NotFound />} />
        <Route path="/edit-user/:id" element={hasAccess ? <AddUser /> : <NotFound />} />
        <Route path="/view-user" element={hasAccess ? <UsersList /> : <NotFound />} />
        <Route path="/update-caseDetails/:id" element={hasAccess ? <AddEmergency /> : <NotFound />} />
        <Route path="/add-ambulance" element={hasAccess ? <AddAmbulance /> : <NotFound />} />
        <Route path="/view-ambulance" element={hasAccess ? <ViewAmbulances /> : <NotFound />} />
      </Routes>
    </>
  );
};


function App() {
  return (

    <BrowserRouter >
      <Provider store={store}>
        <ShowRoutes />
      </Provider>
    </BrowserRouter>
  )
}



export default App
