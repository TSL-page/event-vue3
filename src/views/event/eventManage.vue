<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { getAllEventList } from '@/api/event.js'
import { formatTime } from '@/utils/format.js'
import { drawerEmits, ElMessageBox } from 'element-plus'
import eventEdit from './components/eventEdit.vue'
import { eventDelService } from '../../api/event'
const loading =ref(false) // loading状态
const eventList =ref([])  // 事件列表
const total =ref(0)  // 事件总条数

// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '',
  state: ''
})


// 基于params参数获取事件列表
const getEventList =async () => {
  loading.value = true
  const res = await getAllEventList(params.value)
  eventList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getEventList()


// 分页逻辑
const onSizeChange = (size) => {
  // 每页条数变化了，重新渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  getEventList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getEventList()
}

// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1
  getEventList()
}

// 重置逻辑 => 将筛选条件清空，重新渲染，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = '' // 重置页面
  params.value.state = ''
  getEventList()
}

const eventEditRef = ref()
// 添加逻辑
const onAddevent = () => {
  eventEditRef.value.open({})
}
// 编辑逻辑
const onEditevent = (row) => {
  eventEditRef.value.open(row)
}

// 删除逻辑
const onDeleteevent = async (row) => {
  // 提示用户是否要删除
  await ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
   confirmButtonText: '确定',
   cancelButtonText: '取消',
    type: 'warning'
})
  await eventDelService(row.id)
  ElMessage.success('删除成功')
  // 重新渲染列表
  getEventList()
}


// 添加或者编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数，再渲染
    params.value.pagenum = lastPage
    getEventList()
  } else {
    // 如果是编辑则渲染当前页
    getEventList()
  }
}
</script>

<template>
  <pageContainer title="事件管理">
    <template #extra>
      <el-button type="primary" @click="onAddevent">添加事件</el-button>
    </template>
    <!-- 三行表单想要一行显示则用inline属性  表示行内表单 -->
    <el-form inline>
      <el-form-item label="事件分类:">
        <ChannelSelect v-model="params.cate_id" style="width:240px"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" style="width:240px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="eventList" v-loading="loading">
      <el-table-column label="事件标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{  row.title }}</el-link>
        </template>
      </el-table-column>
      <!--label是展示给用户看的  value是给后台的 -->
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="记录时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button 
          cicle 
          plian 
          type="primary" 
          :icon="Edit" 
          @click="onEditevent(row)"
          ></el-button>
          <el-button 
          cicle 
          plian 
          type="danger" 
          :icon="Delete" 
          @click="onDeleteevent(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[3, 5, 7, 10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top:20px; justify-content: flex-end"
    >
    </el-pagination>

    <!--添加编辑的抽屉 -->
    <eventEdit ref="eventEditRef" @success="onSuccess"></eventEdit>

  </pageContainer> 
</template>

<style lang="scss" scoped></style>