export { auth as middleware } from '@/auth/auth'

// import { auth } from "@/auth/auth"
 
// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/login") {
//     const newUrl = new URL("/login", req.nextUrl.origin)
//     return Response.redirect(newUrl)
//   }
// })