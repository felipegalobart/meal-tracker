import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((request) => {
  if (!request.auth) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico|manifest.json|icons|logo.png).*)",
  ],
}
