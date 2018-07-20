/* eslint-disable import/no-extraneous-dependencies */
import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure } from 'enzyme/build/index';

configure({ adapter: new Adapter() });
