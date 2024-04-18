<template>
<header class="relative z-50 flex-none lg:pt-11">
    <Container class="flex flex-wrap items-center justify-center sm:justify-between lg:flex-nowrap">
      <div class="mt-10 lg:mt-0 lg:grow lg:basis-0">
        <Logo class="h-20 w-auto text-slate-900" />
      </div>
      <div class="order-first -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap border-b border-blue-600/10 py-4 font-mono text-sm text-blue-600 sm:-mx-6 lg:order-none lg:mx-0 lg:basis-auto lg:border-0 lg:py-0">
        <div class="mx-auto flex items-center gap-4 px-4">
          <p>
            <time dateTime="2022-04-04">Reverence Studios Dance Recital - </time>
            <time dateTime="2022-04-06">May 18, 2024</time>
          </p>
          <p>Mechanicsburg, PA</p>
        </div>
      </div>
      <div class="hidden sm:mt-10 sm:flex lg:mt-0 lg:grow lg:basis-0 lg:justify-end">
        <!-- <Button href="/ticket-selection">Get your tickets</Button> -->
        <Button v-if="user" label="Logout" @click="handleLogout" />
        <Button v-else="user" label="Buy Tickets" @click="router.push('/register')" />
      </div>
    </Container>
  </header>
</template>

<script lang="ts" setup>
const { logout } = useStrapiAuth()
import Button from 'primevue/button';
const router = useRouter()
const user = useStrapiUser()

const handleLogout = () => {
  logout()

  router.push('/')
}

</script>
<style>
.logo {
  width: 200px;
}
.plus {
  color: black;
  font-weight: 900;
  font-size: 3rem;
  padding: 0 1rem 0 2rem;
}
</style>