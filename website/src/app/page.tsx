import isEnvElectron from '@/util/isEnvElectron';

export default function Home() {
  return (
    <main style={{padding: '24px'}}>
      <div>{`rootVolumePath: ${process.env.TPR_ROOT_VOLUME_PATH}`}</div>
      <div>{`channelVolumePath: ${process.env.TPR_CHANNEL_VOLUME_PATH}`}</div>
      <div>{process.env.TPRGEN_VOLUME_ROOT}</div>
      <div>{process.env.DOG}</div>
      <div>{'isEnvElectron: ' + isEnvElectron()}</div>
      <div>{'databaseUrl: ' + process.env.DATABASE_URL}</div>
      <div>{'gitCommit: ' + process.env.TPR_GIT_COMMIT}</div>
      <div style={{fontSize: '24px'}}>{'version: ' + process.env.TPR_IMAGE_VERSION}</div>
    </main>
  );
}
