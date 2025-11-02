// Page [ src/stores/user.js ]

import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  // ===============================
  // 🎯 الحالة (State)
  // ===============================
  state: () => ({
    user: {
      isAuthenticated: false,
      id: null,
      name: null,
      surname: null,
      email: null,
      date_of_birth: null,
      access: null,
      refresh: null,
      friends_count: 0,
      gender: null,
      get_avatar: null,
      get_cover: null,
      task_count: 0,
      is_online: false,
      skills: [],
    },
    error: null, // لتخزين الأخطاء إن وجدت
  }),

  // ===============================
  // 🧮 الـ Getters
  // ===============================
  getters: {
    // هل المستخدم مسجل دخول؟
    isLoggedIn: (state) => state.user.isAuthenticated,
    // اسم كامل (الاسم + اللقب)
    fullName: (state) => `${state.user.name || ''} ${state.user.surname || ''}`.trim(),
    // مهارات المستخدم
    userSkills: (state) => state.user.skills || [],
    // التوكن الخاص بالدخول
    userToken: (state) => state.user.access,
  },

  // ===============================
  // ⚡ الـ Actions
  // ===============================
  actions: {
    // --------------------------------
    // 🔄 1. تهيئة بيانات المستخدم عند تحميل الصفحة
    // 🔄 تهيئة المخزن
    // --------------------------------

    initStore() {
      try {
        if (localStorage.getItem('user.access')) {
          this.user.isAuthenticated = true
          this.user.id = localStorage.getItem('user.id')
          this.user.name = localStorage.getItem('user.name')
          this.user.surname = localStorage.getItem('user.surname')
          this.user.email = localStorage.getItem('user.email')
          this.user.date_of_birth = localStorage.getItem('user.date_of_birth')
          this.user.gender = localStorage.getItem('user.gender')
          this.user.get_avatar = localStorage.getItem('user.get_avatar')
          this.user.get_cover = localStorage.getItem('user.get_cover')
          this.user.access = localStorage.getItem('user.access')
          this.user.refresh = localStorage.getItem('user.refresh')
          this.user.friends_count = localStorage.getItem('user.friends_count')
          this.user.task_count = localStorage.getItem('user.task_count')
          this.user.is_online = localStorage.getItem('user.is_online') === 'true'
          const skills = localStorage.getItem('user.skills')
          this.user.skills = skills && skills !== 'undefined' ? JSON.parse(skills) : []
          this.refreshToken()
        } else {
          this.resetUser()
        }
      } catch (error) {
        console.error('❌ خطأ أثناء تهيئة المستخدم:', error)
        this.resetUser()
      }
    },
    // --------------------------------
    // 🔑 2. حفظ التوكنات بعد تسجيل الدخول
    // 🔑 تخزين التوكنات
    // --------------------------------

    setToken(data) {
      this.user.access = data.access
      this.user.refresh = data.refresh
      this.user.isAuthenticated = true
      localStorage.setItem('user.access', data.access)
      localStorage.setItem('user.refresh', data.refresh)
    },
    // --------------------------------
    // ❌ 3. تسجيل الخروج وحذف البيانات
    // --------------------------------
    async logout() {
      try {
        console.log('🔑 إرسال طلب تسجيل الخروج...')
        console.log('Access Token:', this.user.access)
        console.log('Refresh Token:', this.user.refresh)

        if (this.user.refresh) {
          await axios.post(
            'http://127.0.0.1:8000/api/logout/',
            {
              refresh: this.user.refresh,
            },
            {
              headers: {
                Authorization: `Bearer ${this.user.access}`,
              },
            },
          )
          console.log('✅ تم تسجيل الخروج بنجاح')
        } else {
          console.warn('⚠️ لا يوجد Refresh Token لإرساله للسيرفر.')
        }
      } catch (error) {
        if (error.response) {
          console.error('❌ خطأ من السيرفر:', error.response.status, error.response.data)
        } else {
          console.error('❌ خطأ عام:', error.message)
        }
      } finally {
        this.removeToken()
      }
    },
    removeToken() {
      // نرجع كل القيم لحالتها الافتراضية
      this.resetUser()
      // localStorage مسح كل البيانات من
      const fields = [
        'access',
        'refresh',
        'id',
        'name',
        'surname',
        'email',
        'date_of_birth',
        'gender',
        'get_avatar',
        'get_cover',
        'friends_count',
        'task_count',
        'is_online',
        'skills',
      ]
      fields.forEach((field) =>
        localStorage.setItem(`user.${field}`, field === 'skills' ? JSON.stringify([]) : ''),
      )
    },

    // --------------------------------
    // ✍️ 4. تعيين بيانات المستخدم بعد جلبها من السيرفر
    // --------------------------------
    setUserInfo(user) {
      this.user.id = user.id
      this.user.name = user.name
      this.user.surname = user.surname
      this.user.email = user.email
      this.user.date_of_birth = user.date_of_birth
      this.user.gender = user.gender
      this.user.get_avatar = user.get_avatar
      this.user.get_cover = user.get_cover
      this.user.friends_count = user.friends_count
      this.user.task_count = user.task_count
      this.user.is_online = user.is_online
      this.user.skills = user.skills
      // localStorage تخزين القيم في
      Object.keys(this.user).forEach((key) => {
        if (key === 'skills') {
          localStorage.setItem(`user.${key}`, JSON.stringify(this.user[key]))
        } else {
          localStorage.setItem(`user.${key}`, this.user[key] || '')
        }
      })
    },

    // --------------------------------
    // 🔄 5. (Access Token) تحديث رمز الدخول
    // --------------------------------
    async refreshToken() {
      try {
        if (!this.user.refresh) return
        // طلب لتجديد التوكن من السيرفر
        const response = await axios.post('/api/refresh/', { refresh: this.user.refresh })
        // تحديث التوكن في state و localStorage
        this.user.access = response.data.access
        localStorage.setItem('user.access', response.data.access)
        // إضافة التوكن للـ headers الافتراضية
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
      } catch (error) {
        console.error('❌ خطأ أثناء تحديث التوكن:', error)
        this.removeToken()
      }
    },

    // --------------------------------
    // 🔧 6. إعادة تعيين بيانات المستخدم للحالة الافتراضية
    // --------------------------------
    resetUser() {
      this.user = {
        isAuthenticated: false,
        id: null,
        name: null,
        surname: null,
        email: null,
        date_of_birth: null,
        access: null,
        refresh: null,
        friends_count: 0,
        gender: null,
        get_avatar: null,
        get_cover: null,
        task_count: 0,
        is_online: false,
        skills: [],
      }
    },
  },
})
