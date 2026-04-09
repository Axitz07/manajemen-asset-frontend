<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDefaultRouteByRole, login } from '../../stores/authStore'

const router = useRouter()
const errorMessage = ref('')
const isSubmitting = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const submitForm = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const user = await login(form)
    router.push(getDefaultRouteByRole(user?.role))
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-shell">
      <article class="login-card panel">
        <div class="login-copy">
          <h1>Login ke Sistem</h1>
        </div>

        <p v-if="errorMessage" class="notice">{{ errorMessage }}</p>

        <form class="login-form" @submit.prevent="submitForm">
          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" autocomplete="username" required />
          </label>

          <label class="field">
            <span>Password</span>
            <input v-model="form.password" type="password" autocomplete="current-password" required />
          </label>

          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
      </article>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(15, 111, 191, 0.1), transparent 35%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.login-shell {
  width: min(100%, 460px);
}

.login-card {
  display: grid;
  gap: 24px;
  padding: 28px;
}

.login-copy,
.login-form {
  display: grid;
  gap: 12px;
}

.field span {
  color: #64748b;
}

h1,
.notice {
  margin: 0;
}

h1 {
  font-size: clamp(28px, 4vw, 34px);
  color: #111827;
}

.notice {
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
}

.field {
  display: grid;
  gap: 8px;
  font-weight: 700;
}

.field input {
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  background: #ffffff;
}

.btn-primary {
  min-height: 44px;
  border: 1px solid #363636;
  border-radius: 10px;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>
