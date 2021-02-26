import {Stack} from './Stack';

interface Action {
  throwStrategy: 'forward' | 'reverse' | 'throw';
  action: () => void;
}

interface Transition {
  to: string;
  invoke: Action;
}

interface State {
  name: string;
  leave: Action;
  enter: Action;
  invoke: Action;
  transitions: Record<string, Transition>;
}

interface FsmScheme<SN extends string> {
  init: SN;
  states: Record<SN, State>;
}

interface Fsm {}

class BasicFsm<SN extends string> implements Fsm {
  private scheme: FsmScheme<SN>;
  private stack = new Stack<State>({
    limit: 2,
  });

  constructor(scheme: FsmScheme<SN>) {
    this.scheme = scheme;
    const initState = this.selectState(this.scheme.init);
    this.stack.push(initState);
  }

  private selectState = (name: SN) => {
    return this.scheme.states[name];
  };

  public send = (event: string) => {
    const current = this.stack.head();
  };
}
