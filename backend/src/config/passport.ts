import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import config from './index';
import logger from '../utils/logger';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);

      if (user) {
        logger.debug(`User ${user.id} authenticated via JWT`);
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
