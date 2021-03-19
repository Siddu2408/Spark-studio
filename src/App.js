import './App.scss';
import 'antd/dist/antd.css';
import Header from './shared/Header';
import HomePage from './components/HomePage';
function App() {
  return (
    <div className="App">
      <Header name={'NASA Media Search'} /> 
      <HomePage/>   
    </div>
  );
}
export default App;