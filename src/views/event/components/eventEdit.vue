<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { publishEventService, eventDetailService, eventEditService } from '@/api/event'
// 富文本编辑器的包
import {  QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉的显示隐藏
const visiableDrawer = ref(false)

// 图片上传逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  // 预览图片
  imgUrl.value = URL.createObjectURL(uploadFile.raw)  
  // 立刻将图片对象存入formModel.value.vover-imgformModel.value.vover-img将来用于提交
  formModel.value.cover_img = uploadFile.raw
}
// 默认表单数据
const defaultForm = {
  title: '', // 事件标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片
  content: '', // String 内容
  state: '' // 状态
}

// 准备数据
const formModel =ref({ ...defaultForm })

// 组件对外暴露一个方法 ，基于方法，区分是渲染还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id .....}) => 表单需要渲染，说明是编辑
// open调用后，就可以打开弹窗
const editorRef =ref()
const open = async (row) => {
  visiableDrawer.value = true
  if (row.id) {
    try {
      
   
    // 基于row.id发送请求，获取编辑对应的详情数据，进行回显
    const res = await eventDetailService(row.id)
    if (res && res.data) {
      formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台需要的数据格式是file对象格式
    // 将网络图片地址转换为file对象存储起来，便于提交
    const file = await imageUrlToFileObject(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
    } else {
      console.error('No data received from eventDetailService')
    } 
     }catch (error) {
      console.error('Error fetching event details:', error);
    }
    
    
  } else {
    formModel.value = { ...defaultForm } // 基于默认数据重置form数据
    // 这里重置了表单的数据，但是图片上传的地址以及富文本编辑器的内容需要手动重置
    imgUrl.value = ''
    // ntxtTick 为了解决问题引入
    nextTick(() => {
      if (editorRef.value) {
        editorRef.value.setHTML('');
      }
    })
  }
}

// 将网络图片地址转换为file对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

//提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将状态存入 formModel
  formModel.value.state = state
  // 编辑提交时需要的是formData 对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
     // 编辑操作
     await eventEditService(fd)
     ElMessage.success('修改成功')
     visiableDrawer.value = false
     emit('success', 'edit')
  } else {
    // 添加
    await publishEventService(fd)
    ElMessage.success('添加成功')
    visiableDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}

defineExpose({
  open
})
</script>

<template>
  <!--抽屉-->
  <el-drawer
    v-model="visiableDrawer" 
    direction="rtl"
    size="50%"
    :title="formModel.id ? '编辑事件' : '添加事件'"
  >
    <!-- 发表文章表单 -->
    <el-form label-width="100px" :model="formModel" ref="formRef">
      <el-form-item label="事件标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="事件分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="事件记录" prop="cover_img">
        <!--此处需要关闭element-plus 的自动上传，不需要配置action 等参数
        只需要做前端的本地图片预览即可，无需在提交前上传给服务器
        语法：URL。createObjectURL(...) -> 创建本地预览的地址来预览
         -->
        <el-upload 
          class="avatar-uploader" 
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>

      </el-form-item>
      <el-form-item label="事件内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">已发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>