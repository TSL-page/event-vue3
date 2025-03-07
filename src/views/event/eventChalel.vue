<script setup>
import { ref } from 'vue'
import { geteventService,  DeleteeventService, AddeventService } from '../../api/event'
import ChannelEdit from './components/ChannelEdit.vue'
import { Edit, Delete } from'@element-plus/icons-vue'
const channelList =ref([])
const loading = ref(false)
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await geteventService()
  loading.value = false
  channelList.value = res.data.data
}
getChannelList()

// 点击删除按钮执行的操作
const onDelChannel = async (row) => {
  // 一个提示框
  await ElMessageBox.confirm('你确定要删除该数据吗','温馨提示',{
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await DeleteeventService(row.id)
  ElMessage.success('删除成功')
  // 删除后重新进行渲染
  getChannelList()
}
// 编辑按钮操作
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 添加按钮操作
const onAddChannel = () => {
dialog.value.open({})
}
// 子组件通知后我执行的方法
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="事件分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row 就是 channelList 的一项， $index 下标 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <ChannelEdit ref="dailog"></ChannelEdit>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>
<style lang="scss" scoped></style>
