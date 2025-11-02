<template>
  <form @submit.prevent="submitFormSignup">
    <prime_card class="prime_card_form_signup">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <div class="text font-bold text-5xl">Signup</div>
          <!-- <img src="@/assets/Images/Messenger_80x80.png" alt="logo" /> -->
        </div>
      </template>

      <template #content>
        <prime_fluid class="prime_card_form_signup_content">
          <!-- Name fields -->
          <div class="flex gap-2">
            <prime_input_text placeholder="First name" v-model="formSignup.name" />
            <prime_input_text placeholder="Surname" v-model="formSignup.surname" />
          </div>

          <!-- Email -->
          <prime_input_text placeholder="Email" v-model="formSignup.email" />

          <!-- Passwords -->
          <prime_input_password placeholder="Password" v-model="formSignup.password1" />
          <prime_input_password placeholder="Repeat Password" v-model="formSignup.password2" />

          <!-- Birthdate -->
          <div>Date of birth</div>
          <div class="flex gap-2">
            <prime_date_picker v-model="day" view="day" dateFormat="dd" />
            <prime_date_picker v-model="month" view="month" dateFormat="mm" />
            <prime_date_picker v-model="year" view="year" dateFormat="yy" />
          </div>

          <!-- Gender -->
          <div>Gender</div>
          <div class="flex gap-2">
            <prime_radio_button v-model="formSignup.gender" inputId="female" value="Female" />
            <label for="female">Female</label>

            <prime_radio_button v-model="formSignup.gender" inputId="male" value="Male" />
            <label for="male">Male</label>

            <prime_radio_button v-model="formSignup.gender" inputId="custom" value="Custom" />
            <label for="custom">Custom</label>
          </div>
        </prime_fluid>
      </template>

      <template #footer>
        <button type="submit" class="btn_signup mt-2 px-5 py-3 rounded">Signup</button>
      </template>
    </prime_card>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignupForm',
  data() {
    return {
      formSignup: {
        name: '',
        surname: '',
        email: '',
        date_of_birth: '',
        gender: '',
        password1: '',
        password2: '',
      },
      day: '',
      month: '',
      year: '',
      errorsSignup: [],
    }
  },
  methods: {
    async submitFormSignup() {
      this.errorsSignup = []

      // Format date
      if (this.day && this.month && this.year) {
        this.formSignup.date_of_birth = `${this.year.getFullYear()}-${(this.month.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${this.day.getDate().toString().padStart(2, '0')}`
      } else {
        this.errorsSignup.push('Date of birth is missing')
      }

      if (!this.formSignup.name || !this.formSignup.email || !this.formSignup.password1) {
        this.errorsSignup.push('Please fill all required fields')
      }

      if (this.formSignup.password1 !== this.formSignup.password2) {
        this.errorsSignup.push('Passwords do not match')
      }

      if (this.errorsSignup.length > 0) {
        this.$toast.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: this.errorsSignup.join(', '),
          life: 4000,
        })
        return
      }

      try {
        const res = await axios.post('/api/signup/', this.formSignup)
        if (res.data.message === 'success') {
          this.$toast.add({
            severity: 'success',
            summary: 'User Registered',
            detail: 'Check your email to activate your account.',
            life: 3000,
          })
        }
      } catch (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Signup Failed',
          detail: err.message,
          life: 3000,
        })
      }
    },
  },
}
</script>
