import Development from './development.js';
import Production from './production.js';
import Stage from './stage.js';

const getSettings = () => {
  if (window.process == undefined || process.env.NODE_ENV === 'stage') {
    return { HOST_URL: Stage };
  }
  if (process.env.NODE_ENV === 'production') {
    return { HOST_URL: Production };
  }
  return { HOST_URL: Development };
};

export default getSettings;
