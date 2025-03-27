import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User, UserAttributes } from '../models/User';
import config from '../config';

// Extend the Express.User interface to match our User model
declare global {
  namespace Express {
    interface User extends UserAttributes {}
  }
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);

      if (user) {
        // Convert the Sequelize model instance to a plain object
        const userObject = user.get({ plain: true });
        return done(null, userObject);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
