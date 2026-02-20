import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    console.log("DEBUG headers:", Object.fromEntries(request.headers.entries()))
    console.log("DEBUG request.url:", request.url)
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host
    const proto = request.headers.get("x-forwarded-proto") ?? (request.url.startsWith("https") ? "https" : "http")
    const loginUrl = new URL(`${proto}://${host}/login`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico|manifest.json|icons).*)",
  ],
}
