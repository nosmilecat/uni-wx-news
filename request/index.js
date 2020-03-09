import axios from '@/js_sdk/gangdiedao-uni-axios'


axios.defaults.baseURL =  'http://47.104.160.240/small_program/api'

// 拦截器 在请求之前拦截
axios.interceptors.request.use(function(config) {
    return config;
}, function(error) {
    return Promise.reject(error.data.error.message);
})
// 拦截器 在请求之后拦截
axios.interceptors.response.use(response => {
	if(response.data.code === 200) {
		return response.data.result
	}
	uni.showToast({
		title: response.data.message
	})
}, error => {
    return Promise.reject(error.message)
})

export default axios