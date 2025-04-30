<template>
  <div class="layout-main-container">
    <div class="layout-header">
      <!-- <AppHeader /> -->
    </div>
    <AdminSideBar>
    <div class="layout-main">
      <div class="grid">
        <div class="col-10">
          <slot />
        </div>
      </div>
    </div>
    </AdminSideBar>
    <!-- <AppFooter /> -->
    <Toast />
  </div>
</template>