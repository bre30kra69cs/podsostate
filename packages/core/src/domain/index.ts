import {createTransition} from './createTransition';
import {wait} from '../utils/wait';

const test = async () => {
  console.log(1);
  await wait(2000);
  console.log(2);
};

const {startEvent, container} = createTransition(test);

container.send(startEvent);
