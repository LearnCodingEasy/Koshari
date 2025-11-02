<!--  -->
<template>
  <form @submit.prevent="submitFormLogin">
    <prime_card class="prime_card_form_login">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <div class="text font-bold text-5xl">Log in</div>
          <div class="image_logo">
            <!-- <img src="@/assets/Images/Messenger_80x80.png" alt="logo" /> -->
          </div>
        </div>
      </template>

      <template #content>
        <prime_fluid class="prime_card_form_login_content">
          <!-- Email -->
          <prime_input_text placeholder="Email" v-model="formLogin.email" />
          <!-- Password -->
          <prime_input_password
            placeholder="Password"
            v-model="formLogin.password"
            autocomplete="off"
          />
        </prime_fluid>

        <!-- Social login -->
        <div class="mt-4">
          <prime_button
            icon="pi pi-google"
            label="تسجيل عبر Google"
            severity="success"
            @click="loginWithGoogle"
          />
          <prime_button
            icon="pi pi-facebook"
            label="تسجيل عبر Facebook"
            severity="info"
            class="ml-2"
            @click="loginWithFacebook"
          />
        </div>
      </template>

      <template #footer>
        <button type="submit" class="btn_login mt-2 px-5 py-3 rounded">Log In</button>
      </template>
    </prime_card>
  </form>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'

export default {
  name: 'LoginForm',
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      formLogin: {
        email: '',
        password: '',
      },
      errorsLogin: [],
    }
  },
  methods: {
    async submitFormLogin() {
      this.errorsLogin = []

      if (!this.formLogin.email || !this.formLogin.password) {
        this.$toast.add({
          severity: 'error',
          summary: 'Missing Data',
          detail: 'Email and Password are required!',
          life: 3000,
        })
        return
      }

      try {
        const res = await axios.post('/api/login/', this.formLogin)
        this.userStore.setToken(res.data)
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`

        // get user info
        const userRes = await axios.get('/api/me/')
        this.userStore.setUserInfo(userRes.data)
        this.$router.push('/')
      } catch (err) {
        console.log('err: ', err)
        this.$toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Email or password incorrect.',
          life: 3000,
        })
      }
    },
    loginWithGoogle() {
      const width = 500
      const height = 600
      const left = (screen.width - width) / 2
      const top = (screen.height - height) / 2
      const url = 'http://127.0.0.1:8000/accounts/google/login/'

      const popup = window.open(
        url,
        'GoogleLogin',
        `width=${width},height=${height},top=${top},left=${left}`,
      )

      // استمع للرسالة بعد نجاح تسجيل الدخول
      window.addEventListener('message', (event) => {
        if (event.origin !== 'http://127.0.0.1:8000') return
        const { token, user } = event.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        popup.close()
      })
    },
    loginWithFacebook() {
      window.location.href = 'http://127.0.0.1:8000/accounts/facebook/login/'
    },
  },
}
</script>
