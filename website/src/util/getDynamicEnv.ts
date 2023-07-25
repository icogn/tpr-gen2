let env: {[key: string]: string | undefined};

function getDynamicEnv() {
  if (!env) {
    if (!process.env.TPR_IMAGE_VERSION) {
      throw new Error(
        'This is likely throwing because a route is trying to statically resolve the dynamic environment.\n  See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config',
      );
    }
    env = process.env;
  }

  return env;
}

export default getDynamicEnv;
