import isEnvElectron from '@/util/isEnvElectron';
import SharedSettingsPage from './features/sharedSettingsPage/SharedSettingsPage';

export default function Home() {
  return (
    <main style={{ padding: '24px' }}>
      <div style={{ display: 'none' }}>
        <div>{`rootVolumePath: ${process.env.TPR_ROOT_VOLUME_PATH}`}</div>
        <div>{`channelVolumePath: ${process.env.TPR_CHANNEL_VOLUME_PATH}`}</div>
        <div>{process.env.TPRGEN_VOLUME_ROOT}</div>
        <div>{`DOG: ${process.env.DOG}`}</div>
        <div>{'isEnvElectron: ' + isEnvElectron()}</div>
        <div>{'databaseUrl: ' + process.env.DATABASE_URL}</div>
        <div>{'gitCommit: ' + process.env.TPR_GIT_COMMIT}</div>
        <div style={{ fontSize: '24px' }}>{'version: ' + process.env.TPR_IMAGE_VERSION}</div>
        <div>This is new junk text</div>
      </div>
      <SharedSettingsPage />
    </main>
  );
}
