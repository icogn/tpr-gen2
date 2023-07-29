import {askStartupUpdateReady} from '#preload';
import {useState, useEffect} from 'react';
import styles from './AutoUpdatePopup.module.css';

function AutoUpdatePopup() {
  const [version, setVersion] = useState(false);

  useEffect(() => {
    askStartupUpdateReady().then((response: string) => {
      console.log(`Reponse back for startup update ready: "${response}"`);
      if (response) {
        setVersion(response);
      }
    });
  }, []);

  if (!version) {
    return null;
  }
  return (
    <div className={styles.root}>
      <div>{`Update for version "${version}" is ready.`}</div>
      <button>Update Now</button>
      {/* <button>X</button> */}
    </div>
  );
}

export default AutoUpdatePopup;
