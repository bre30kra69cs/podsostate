export type Action = () => void;

export type AsyncAction = () => Promise<void>;

interface ActionRunnerConfig {
  action: Action;
  start?: Action;
  resolve?: Action;
  reject?: Action;
}

export const runAction = (config: ActionRunnerConfig) => {
  config.start?.();
  try {
    config.action();
    config.resolve?.();
  } catch {
    config.reject?.();
  }
};

interface AsyncActionRunnerConfig {
  asyncAction: AsyncAction;
  start?: Action;
  resolve?: Action;
  reject?: Action;
}

export const runAsyncAction = (config: AsyncActionRunnerConfig) => {
  config.start?.();
  const wrapped = async () => {
    try {
      await config.asyncAction();
      config.resolve?.();
    } catch {
      config.reject?.();
    }
  };
  wrapped();
};

export const createAsyncActionRunner = (config: AsyncActionRunnerConfig) => async () => {
  config.start?.();
  try {
    await config.asyncAction();
    config.resolve?.();
  } catch {
    config.reject?.();
  }
};
