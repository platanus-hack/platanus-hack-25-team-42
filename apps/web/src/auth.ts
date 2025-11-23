import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins/oidc-provider";
import { passkey } from "better-auth/plugins/passkey";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { userData } from "./db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    oidcProvider({
      loginPage: "/login",
      consentPage: "/consent",
      allowDynamicClientRegistration: true,
      getAdditionalUserInfoClaim: async (_user, _scopes, _client) => {
        
        const claims: Record<string, any> = {};
        claims["iss"] = process.env.BETTER_AUTH_URL! + "/api/auth";

        // Obtener datos del usuario desde la base de datos
        try {
          // Consultar directamente la base de datos
          const result = await db
            .select()
            .from(userData)
            .where(eq(userData.userId, _user.id));
          
          // Crear un objeto con los datos del usuario organizados por tipo
          const userInfo: Record<string, string> = {};
          
          // Procesar los datos obtenidos
          if (result && result.length > 0) {
            result.forEach((item) => {
              userInfo[item.type] = item.value;
            });
            
            // Agregar la información al claim
            claims["info"] = userInfo;
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          claims["info"] = {
            rut: "1234567-8", // Valor por defecto en caso de error
          };
        }

        return claims;
      },
      metadata: {
        issuer: process.env.BETTER_AUTH_URL! + "/api/auth",
      },
    }),
    passkey(),
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] Email: ${email}, Code: ${otp}, Type: ${type}`);
      },
    }),
  ],
});
