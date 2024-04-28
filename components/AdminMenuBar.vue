<template>
    <Menubar :model="items">
    <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
    </template>
</Menubar>
</template>

<script setup lang="ts">
const router = useRouter();
const items = ref([
    {
        label: 'Index',
        icon: 'pi pi-link',
        command: () => {
            router.push('/admin');
        }
    },
    {
        label: 'Shows',
        icon: 'pi pi-link',
        command: () => {
            router.push('/admin/shows');
        }
    },
    {
        label: 'Access',
        icon: 'pi pi-link',
        command: () => {
            router.push('/admin/access');
        }
    },
    {
        label: 'Tickets',
        icon: 'pi pi-link',
        command: () => {
            router.push('/admin/tickets');
        }
    },
]);

</script>

<style scoped>

</style>