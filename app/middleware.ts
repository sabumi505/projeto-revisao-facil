export { default } from "next-auth/middleware";

export const config = {
  // specify the route you want to protect
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
