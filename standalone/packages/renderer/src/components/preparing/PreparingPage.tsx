import {useState, useEffect} from 'react';
// import {cancelAutoInstall, askDbReady, askWebsiteReady} from '#preload';
import {askDbReady, askWebsiteReady} from '#preload';
import FullScreenPopup from '../FullScreenPopup';

// function handleCancelAutoInstall() {
//   console.log('cancel auto install');
//   cancelAutoInstall();
// }

function PreparingPage() {
  const [dbReady, setDbReady] = useState('pending');
  const [websiteReady, setWebsiteReady] = useState('pending');

  useEffect(() => {
    console.log('window.origin');
    console.log(window.origin);

    askDbReady().then((response: boolean) => {
      console.log(`dbResponseIfReady:${response}`);
      setDbReady(String(response));
    });

    askWebsiteReady().then((response: boolean) => {
      console.log(`websiteResponseIfReady:${response}`);
      setWebsiteReady(String(response));
    });
  }, [setDbReady, setWebsiteReady]);

  if (dbReady !== 'true' || websiteReady !== 'true') {
    return (
      <FullScreenPopup>
        <div>PreparingPage</div>
        <div>dbReady: {dbReady}</div>
        <div>websiteReady: {websiteReady}</div>
        {/* <button onClick={handleCancelAutoInstall}>cancelAutoInstall</button> */}
      </FullScreenPopup>
    );
  }
  return null;
}

export default PreparingPage;
