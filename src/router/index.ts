import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import RegisterSuccessView from '@/views/RegisterSuccessView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ChangePassword from '@/views/ChangePasswordView.vue'
import TaskManagerView from '@/views/TaskManagerView.vue'
import ArchivedTasksView from '@/views/ArchivedTasksView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/register-success',
      name: 'RegisterSuccess',
      component: RegisterSuccessView
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
      props: true
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: TaskManagerView
    },
    {
      path: '/archive',
      name: 'Archive',
      component: ArchivedTasksView
    }
  ]
})

const isLoggedIn = () => {
  return localStorage.getItem('token')
}

const protectedRoutes = ['Profile', 'Tasks', 'Archive']

router.beforeEach(async (to, from, next) => {
  if (to.name && protectedRoutes.includes(to.name.toString()) && !isLoggedIn()) {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

export default router