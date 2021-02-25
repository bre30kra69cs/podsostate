import {createActivityFsm} from './activityFsm';
import {wait} from '../utils/wait';

const test = async () => {
  await wait(1000);
};

const testActivity = createActivityFsm(test);

testActivity.subscribe(console.log);

testActivity.send('start');
