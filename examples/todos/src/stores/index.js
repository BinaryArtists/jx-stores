import Stores from '@ice/store';
import logger from '@ice/store-logger';
import todos from './todos';

const stores = new Stores('todos');
const plugins = [];

if (process.env.NODE_ENV !== 'production') {
  plugins.push(logger);
}

stores.mix(plugins);
stores.use('todos', todos);

export default stores;
