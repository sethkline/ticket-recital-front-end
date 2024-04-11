<script setup lang="ts">
const { resetPassword } = useStrapiAuth()
const router = useRouter()

const onSubmit = async () => {
  try {
    await resetPassword({ code: '', password: '', passwordConfirmation: '' })

    router.push('/authenticated-page')
  } catch (e) {}
}
</script>