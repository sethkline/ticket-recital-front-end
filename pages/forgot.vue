<script setup lang="ts">
const { forgotPassword } = useStrapiAuth()
const router = useRouter()

const onSubmit = async () => {
  try {
    await forgotPassword({ email: '' })

    router.push('/')
  } catch (e) {}
}
</script>