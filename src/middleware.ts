import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';
import { SITE_URL } from 'astro:env/server';
import { UserDB } from './db/user';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/app(.*)']);

async function createUserIfNotExists(userId: string) {
  const user = await UserDB.getUser(userId);
  if (!user) {
    await UserDB.createUser({ id: userId });
  }
}
export const onRequest = clerkMiddleware(
  (auth, context, next) => {
    const { userId, redirectToSignIn } = auth();
    if (!userId && isProtectedRoute(context.request)) {
      createUserIfNotExists(userId || '');
      return redirectToSignIn({
        returnBackUrl: '/signin',
      });
    }
    if(isProtectedRoute(context.request) && userId){
      createUserIfNotExists(userId || '');
    }
    return next();
  },
  {
    authorizedParties: ['http://localhost:4321', SITE_URL],
    domain: SITE_URL,
    afterSignInUrl: '/app',
    signInUrl: '/signin',
    signUpUrl: '/signup',
    afterSignUpUrl: '/app',
  }
);
