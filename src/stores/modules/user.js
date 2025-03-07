import { defineStore } from "pinia"
import { ref } from "vue"
import { useGetInfoService } from "../../api/user"

//用户模块 token settoken removetoken
export const useUserStore =defineStore('user', () => {
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = (newToken) => {
    token.value = ''
  }

  const user = ref({})
  const getUser = async () => {
    const res = await useGetInfoService()
    user.value = res.data.data
  } 

  const setUser = (obj) => {
    user.value = obj
  }
  return {
    token,
    removeToken,
    setToken,
    user,
    getUser,
    setUser
  }
},{
  persist: true
})