import {askStartupUpdateReady} from '#preload';
import {useState, useEffect} from 'react';

function AutoUpdatePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    askStartupUpdateReady().then((response: string) => {
      console.log(`Reponse back for startup update ready: "${response}"`);
      if (response) {
        setShow(true);
      }
    });
  }, []);

  if (!show) {
    return null;
  }
  return <div>in autoupdate popup</div>;
}

export default AutoUpdatePopup;
