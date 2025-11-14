const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Client = require("../models/Client");
 // Replace with your actual client model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let client = await Client.findOne({ googleId: profile.id });

        if (!client) {
            client = await Client.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                isGoogleSignup: true,
            });
        }

        return done(null, client);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((client, done) => {
    done(null, client.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const client = await Client.findById(id);
        done(null, client);
    } catch (err) {
        done(err, null);
    }
});
