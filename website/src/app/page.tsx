import isEnvElectron from '@/util/isEnvElectron';

export default function Home() {
  return (
    <main>
      <div>{`rootVolumePath: ${process.env.ROOT_VOLUME_PATH}`}</div>
      <div>{`channelVolumePath: ${process.env.CHANNEL_VOLUME_PATH}`}</div>
      <div>{process.env.TPRGEN_VOLUME_ROOT}</div>
      <div>{process.env.DOG}</div>
      <div>{'isEnvElectron: ' + isEnvElectron()}</div>
      <div>{'databaseUrl: ' + process.env.DATABASE_URL}</div>
      <div>{'gitCommit: ' + process.env.GIT_COMMIT}</div>
    </main>
  );
}
