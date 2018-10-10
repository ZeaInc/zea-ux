import Development from './development';
import Production from './production';
import Stage from './stage';

const getSettings = () => {
  if (process.env.NODE_ENV === 'production') {
    return { HOST_URL: Production };
  }
  if (process.env.NODE_ENV === 'stage') {
    return { HOST_URL: Stage };
  }
  return { HOST_URL: Development };
};

export default getSettings;
