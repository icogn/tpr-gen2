if (process.env.NODE_ENV === 'production') {
  process.env.DOG = 'DOG_VAL_PRODUCTION';
  // In production, the config is provided by docker swarm configs.
  // require('dotenv').config({path: '/env_config'});

  // TODO: need to handle for production electron.
} else {
  process.env.DOG = 'DOG_VAL_DEVELOPMENT';
}

// Only here so we don't get "File '.../instrumentationImpl.ts' is not a
// module." error.
export const junkExport = 'junkExport';
