function getYarnCommand() {
  return process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
}

export default getYarnCommand;
