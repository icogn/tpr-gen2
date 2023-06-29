// From https://github.com/vercel/next.js/issues/42292#issuecomment-1491127192

// type AFC<P = {}> = (
type AsyncFunctionComponent<P = object> = (
  ...args: Parameters<React.FunctionComponent<P>>
) => Promise<ReturnType<React.FunctionComponent<P>>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asSyncComponent<T extends AsyncFunctionComponent<any>>(
  component: T,
): React.FunctionComponent<T extends AsyncFunctionComponent<infer P> ? P : never> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return component as any;
}

export default asSyncComponent;
