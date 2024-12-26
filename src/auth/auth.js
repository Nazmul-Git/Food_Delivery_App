
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Github from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,  
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,  
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,  
      clientSecret: process.env.GITHUB_CLIENT_SECRET,  
    }),
  ],
  
  secret: process.env.AUTH_SECRET, 
})