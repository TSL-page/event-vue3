<script setup>
import { geteventService  } from '@/api/event.js'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type:String
  }
})
const emit = defineEmits(['update:modelValue'])

// 请求分类数据放在channelList 里面
const channelList = ref([])
const getChannelList = async () => {
  const res = await geteventService()
  channelList.value = res.data.data
}
getChannelList()
</script>


<template>
  <!--label展示给用户看的  value 收集起来交给后台的 :style 传递给抽屉里的下拉框使用的 -->
  <el-select 
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }" 
    >
    <el-option 
    v-for="channel in channelList"
    :key="channel.id"
    :label="channel.cate_name" 
    :value="channel.id"
    ></el-option>
  </el-select>
</template>