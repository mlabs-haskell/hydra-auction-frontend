import ErrorStackParser from 'error-stack-parser';
export const trackError = (
  error: Error,
  functionName: string,
  mixPanel?: any,
  params: any = {}
) => {
  const stackFrames = ErrorStackParser.parse(error);
  mixPanel?.track('Error', {
    name: error.name,
    message: error.message,
    cause: error.cause,
    stack: stackFrames,
    function: functionName,
    params: params,
    timestamp: Date.now(),
  });
};
