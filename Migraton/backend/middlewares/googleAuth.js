// middlewares/googleAuth.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Client = require("../models/Client"); // assuming PG owners use Client model

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/clients/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if client already exists
        const existingClient = await Client.findOne({ googleId: profile.id });
        if (existingClient) return done(null, existingClient);

        // Else create a new client
        const newClient = await Client.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        done(null, newClient);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const client = await Client.findById(id);
  done(null, client);
});
