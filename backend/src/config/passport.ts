import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import config from './index';
import logger from '../utils/logger';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

logger.info(`JWT strategy initialized with secret key: ${config.jwt.secret.substring(0, 5)}...`);

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      logger.info(`JWT authentication attempt for payload: ${JSON.stringify(payload)}`);

      if (!payload.id) {
        logger.warn('JWT payload missing id field');
        return done(null, false);
      }

      const user = await User.findByPk(payload.id);

      if (user) {
        logger.info(`User ${user.id} (${user.email}) authenticated via JWT`);
        return done(null, user);
      }

      logger.warn(`JWT authentication failed: User ${payload.id} not found`);
      return done(null, false);
    } catch (error) {
      logger.error('Error in JWT authentication:', error);
      return done(error, false);
    }
  })
);

export default passport;
