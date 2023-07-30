import {askStartupUpdateReady, triggerStartupUpdate} from '#preload';
import {useState, useEffect} from 'react';
import styles from './AutoUpdatePopup.module.css';

function AutoUpdatePopup() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    askStartupUpdateReady().then((response: string) => {
      console.log(`Reponse back for startup update ready: "${response}"`);
      if (response) {
        setVersion(response);
      }
    });
  }, []);

  const handleClick = () => {
    triggerStartupUpdate();
  };

  if (!version) {
    return null;
  }
  return (
    <div className={styles.root}>
      <div>{`Update for version "${version}" is ready.`}</div>
      <button onClick={handleClick}>Update Now</button>
      {/* <button>X</button> */}
    </div>
  );
}

export default AutoUpdatePopup;
