import passport from 'passport';
import prisma from '../prisma/client.ts'
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email: string, password: string, done) => {
            console.log("[Passport] Stratégie appelée avec email :", email); // Log 1
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if (!user) {
                    console.log("[Passport] Utilisateur non trouvé."); // Log 2
                    return done(null, false, { message: "Utilisateur non trouvé." });
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    console.log("[Passport] Mot de passe incorrect."); // Log 3
                    return done(null, false, { message: "Mot de passe incorrect." });
                }
                console.log("[Passport] Authentification réussie pour l'utilisateur ID :", user.id); // Log 4
                return done(null, user);
            } catch (err) {
                console.error("[Passport] Erreur dans la stratégie :", err); // Log 5
                return done(err);
            }
        }
    )
);

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || "jwt_secret"
        },
        async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: payload.id
                    }
                })
                if (!user) return done(null, false)
                return done(null, user)
            } catch (error) {
                return done(error, false)
            }
        }
    )
)

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        done(null, user);
    } catch (err) {
        done(err);
    }
});