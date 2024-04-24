// middleware/admin.js
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useStrapiUser(); // Assuming useStrapiUser() returns the current user's object
  console.log(user, user.value , 'user');
  if (!user.value || user.value?.role?.name !== 'Ticket Admin') {
    return navigateTo('/register'); // Redirect non-admin users to the login page
  }
});