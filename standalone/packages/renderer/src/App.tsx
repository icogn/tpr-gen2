import './App.css';
import AutoUpdatePopup from './components/autoUpdatePopup/AutoUpdatePopup';
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
      <AutoUpdatePopup />
    </>
  );
}

export default App;
