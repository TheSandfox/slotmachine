import { Slotmachine } from "./components/Slotmachine"
import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom"

function App() {
	return <HashRouter>
		<Routes>
			<Route path='/:displayEdit' element={<Slotmachine/>}/>
			<Route path='*' element={<Slotmachine/>}/>
		</Routes>
	</HashRouter>
}

export default App
