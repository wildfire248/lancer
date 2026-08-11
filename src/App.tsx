import './App.css'
import About from './components/About.tsx';

function App() {
  return (
    <>
      <header>
        <div className="top-bar">
          <p className="version">V.0.0.1</p>
        </div>
        <div className="title">
          <h1>COMP/CON</h1>
        </div>
      </header>
      <div className="buffer"></div>
      <div className="console">
        <p>This is console text.</p>
      </div>
      <footer>
        <div className="align-right">
          <About/>
        </div>
      </footer>
    </>
  )
}

export default App;
