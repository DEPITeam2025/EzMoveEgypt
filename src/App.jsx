import './App.css'
import router from './routes/routes'
import {RouterProvider} from 'react-router'

function App() {
    return <RouterProvider router={router} />;
}

export default App;