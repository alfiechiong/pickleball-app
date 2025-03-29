import app from './app';
import config from './config';
import logger from './utils/logger';

const PORT = config.port || 3000;

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
