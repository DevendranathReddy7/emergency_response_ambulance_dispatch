import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddEmergency from "./components/AddEmergency";
import SideBar from "./common/sideBar";
import store from "./store/store";
import { Provider } from "react-redux";


function App() {

  return (
    <Provider store={store}>
      <BrowserRouter >
        <SideBar />
        <Routes>
          <Route path="/log-emergency" element={<AddEmergency />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
