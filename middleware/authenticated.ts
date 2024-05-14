// middleware/authenticated.js
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useStrapiUser()
  if (!user.value) {
    return navigateTo('/login'); // Redirect to login page if not authenticated
  }
});
