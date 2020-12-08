import Vue from 'vue'
import App from './App'
import store from './store/index'
import './styles/index.scss'


Vue.prototype.islogin = function() {
	var isLogin = uni.getStorageSync('login');
	if (!isLogin) {
		uni.navigateTo({
			url: '../wxauthorize/wxauthorize'
		});
		return false
	}else{
		return true
	}
}

Vue.config.productionTip = false

App.mpType = 'app'

var app = new Vue({
	...App,
	store
})
app.$mount()
