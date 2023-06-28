import FullScreenPopup from '../FullScreenPopup';
import type {ChannelInfo} from '../../../../shared/types';
import styles from './VersionChangePopup.module.css';

type VersionChangePopupProps = {
  channelInfo: ChannelInfo;
  onCancel: () => void;
  onDownloadClick: () => void;
};

function VersionChangePage({channelInfo, onCancel, onDownloadClick}: VersionChangePopupProps) {
  return (
    <FullScreenPopup>
      <div className={styles.title}>Swap generator branch</div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>name:</td>
              <td>{channelInfo?.name} </td>
            </tr>
            <tr>
              <td>version:</td>
              <td>{channelInfo?.latestVersion}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.bodyText}>
        Once the download is complete, the generator will restart to install the new version. This
        may take several seconds.
      </div>

      <div className={styles.bodyText}>
        This is an non-stable branch. Backwards compatibility between versions is not maintained.
        This will not affect your data on the stable branch.
      </div>

      <div className={styles.buttonsWrapper}>
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={onDownloadClick}
          className={styles.buttonsRightBtn}
        >
          Start Download
        </button>
      </div>
    </FullScreenPopup>
  );
}

export default VersionChangePage;
