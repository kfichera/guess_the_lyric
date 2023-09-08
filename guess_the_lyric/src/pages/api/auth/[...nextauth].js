import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import { LOGIN_URL } from '../../../../lib/spotify';
import fetch from 'node-fetch';

async function refreshAccessToken(token) {
  //refreshing the access token

  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", token.refreshToken)

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    body: params
  })

  const data = await response.json()
    return {
        ...token,
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? token.refreshToken,
        accessTokenExpires: Date.now() + data.expires_in * 1000
    }
}


export default NextAuth({
  providers: [
    // OAuth authentication providers...
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // add more providers here
  ],
  secret: process.env.JWT_SECRET,
  //login routes
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        //first time sign in
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at
        return (token)
      }

      if (Date.now < token.accessTokenExpires * 1000) {
        //token hasnt expired
        return (token)
      }
      //access token has expired
      return refreshAccessToken(token)
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  }
});