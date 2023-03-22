import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import BuyCoffee from './pages/BuyCoffee/BuyCoffee';
import Staking from './pages/Staking/Staking';
import {WalletProvider} from './context/WalletContext'

function App() {
  return (
  <WalletProvider>
    <div className="App">

      <Header/>
      <Staking/>
      <BuyCoffee/>

 
    </div>
  </WalletProvider>
  );
}

export default App;
