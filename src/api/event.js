import request from '@/utils/request'
// 获取事件分类
export const geteventService =() => {
  return request.get('/my/cate/list')
}
// 添加事件分类
export const AddeventService = (data) => {
  return request.post('/my/cate/add',data)
}
// 编辑事件分类
export const EditeventService = (data) => {
  return request.put('/my/cate/info',data)
}
// 删除事件分类
export const DeleteeventService = (id) => {
  return request.delete('/my/cate/del', {
    params: { id }
  })
}

// 获取事件列表
export const getAllEventList = (params) => {
  return request.get('/my/article/list',{ 
    params 
  })
}

// 添加事件 data需要
export const publishEventService = (data) => {
  return request.post('/my/article/add',data)
}

// 获取详情
export const eventDetailService = (id) => {
  return request.get('/my/article/info', {
    params: { id }
  })
}

// 编辑事件接口
export const eventEditService = (data) => {
 return request.put('/my/article/info', data)
}

// 删除接口
export const eventDelService = (id) => {
  return request.delete('/my/article/info', {
    params: { id }
  })
}