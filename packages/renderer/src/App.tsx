import './App.css';
import PreparingPage from './components/preparing/PreparingPage';
import VersionChangeContainer from './components/versionChange/VersionChangeContainer';

function App() {
  return (
    <>
      <iframe
        id="contentIframe"
        src="http://localhost:3000"
      ></iframe>
      <PreparingPage />
      <VersionChangeContainer />
    </>
  );
}

export default App;
