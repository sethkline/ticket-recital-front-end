// middleware/authenticated.js
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useStrapiUser()
  if (!user.value) {
    return navigateTo('/register'); // Redirect to login page if not authenticated
  }
});
