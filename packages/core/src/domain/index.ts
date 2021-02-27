import {createActivityFsm} from './activityFsm';
import {wait} from '../utils/wait';
import {createTransitionFsm} from './transitionFsm';

const action = () => {
  // throw new Error('test error1');
};

const activity = async () => {
  transitionFsm.send('END');
  await wait(3000);
  console.log(1);
  throw new Error('test error2');
};

const transitionFsm = createTransitionFsm({
  strategy: 'reverse',
  action,
  activity,
  setTo: () => console.log('setTo'),
});

transitionFsm.subscribe(console.log);

transitionFsm.send('START');
transitionFsm.send('REVERSE');
transitionFsm.send('END');
