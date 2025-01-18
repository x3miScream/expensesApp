import logo from './logo.svg';
import './App.css';
import ExpensesApp from './Components/ExpensesApp/ExpensesApp.jsx'
import { AuthContextProvider } from './Contexts/AuthContext.jsx';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <ExpensesApp></ExpensesApp>
      </AuthContextProvider>
    </div>
  );
}

export default App;
