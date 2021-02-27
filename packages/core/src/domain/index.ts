import {createActivityFsm} from './activityFsm';
import {wait} from '../utils/wait';

const activity = async () => {
  await wait(1000);
};

const activityFsm = createActivityFsm(activity);
activityFsm.subscribe(console.log);
activityFsm.send('LOAD');
