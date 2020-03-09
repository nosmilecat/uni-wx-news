import Vue from 'vue'
import App from './App'
import './fonts/iconfont.css'
import axios from '@/request/index.js'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
