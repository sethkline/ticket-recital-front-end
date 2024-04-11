<script setup lang="ts">
const { login } = useStrapiAuth()
const router = useRouter()

const onSubmit = async () => {
  try {
    await login({ identifier: '', password: '' })

    router.push('/authenticated-page')
  } catch (e) {}
}
</script>