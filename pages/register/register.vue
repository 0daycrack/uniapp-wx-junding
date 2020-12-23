<template>	
	<view class="zai-box">
		<image src="../../static/zaizai-login/logo.png" mode='aspectFit' class="zai-logo"></image>
		<view class="zai-title"></view>
		<form>
			<view class="cu-form-group">
				<view class="title">真实姓名</view>
				<input placeholder-class v-model="username" placeholder="请输入姓名" name="input"></input>
			</view>
			<!-- <input class="zai-input" placeholder-class v-model="username" placeholder="请输入姓名" /> -->
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input placeholder="请输入手机号" placeholder-class v-model="mobile" name="input"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">公司编号</view>
				<input placeholder-class v-model="companyid" placeholder="请输入公司ID" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">公司名称</view>
				<input placeholder-class v-model="companyname" placeholder="请输入公司名称" name="input"></input>
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-gradual-blue round" @tap="login()">立即注册</button>
			</view>
						
<!-- 			<button class="cu-btn" @tap="register">立即注册</button>
 -->			<!-- <navigator url="../login/login" open-type='navigateBack' hover-class="none" class="zai-label">已有账号，点此去登录.</navigator> -->
		</form>
	</view>
</template>

<script>
	var api = require('@/common/api.js')
	export default {
		onLoad() {

		},
		data() {
			return {
				loading: false,
				username: "",
				mobile: "",
				level:"",
				companyid:"",
				companyname:"",
			};
		},
		methods: {
			register:function(arg_level){
				api.get({
					//url: 'https://www.ucharts.cn/data.json',
					url: 'register',
					data:{
						username: this.username,
						mobile: this.mobile,
						device_type: api.DeviceType,
						openid:uni.getStorageSync('openid'),
						// 首次注册等级为6级
						level:arg_level,
						superior:"",
						companyid:this.companyid,
						companyname:this.companyname
					},
					success: function(res) {
						if (res['code'] == "success") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: res['code']
							});
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
								//url: '../grid/grid'
							});
							// uni.setStorageSync('upload', 1)
							// uni.setStorageSync('login', 1)
							// uni.setStorageSync('token', data.data.token)
							// uni.setStorageSync('user', data.data.user)
							setTimeout((e => {
								uni.navigateBack();
							}), 500);
						}
						if (res['code'] == "failed") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: res['code']
							});
						}
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
			},
			login() {
				console.log(this.companyname)
				this.loading = true;
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入真实姓名'
					});
					this.loading = false;
					return;
				}
				if (this.mobile == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
					});
					this.loading = false;
					return;
				}
				if (this.companyid == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入公司编号'
					});
					this.loading = false;
					return;
				}
				if (this.companyname == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入公司名称'
					});
					this.loading = false;
					return;
				}
				var that=this;
				// 注册为超级管理员
				if (this.companyid=='88888888'){
					if(this.companyname=='超级管理员'){
						// 注册为0级用户
						that.register(0);
					}
				}else{
					if (this.companyid=='66666666'){
						if(this.companyname=='授权用户'){
							// 注册为0级用户
							that.register(6);
						}
					}
					this.judgecompany() //判断公司名称、ID是否匹配
				}

			},
			judgecompany(){
				var that=this;
				var companyname=this.companyname
				console.log(companyname)
				api.get({
					//url: 'https://www.ucharts.cn/data.json',
					url: 'judgecompany',
					data:{
						companyid: this.companyid,
					},
					success: function(res) {
						console.log(companyname)
						console.log(res['companyname'])						
						if(res!= null){
							if (res['companyname']==companyname) {
								this.loading = false;
								uni.showToast({
									duration: 500,
									icon: 'success',
									title: res['companyname']
								});
								//执行注册, 等级6级
								that.register(6);
							}else{
								uni.showToast({
									duration: 500,
									icon: 'success',
									title: "ID与名称不匹配"
								});
								return;
							}
						}else{
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: "不存在该ID"
							});
							return;
						}
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
			},
		}
	}
</script>

<style>
	.zai-box{
		padding: 0 100upx;
		position: relative;
	}
	.zai-logo{
		width: 100%;
		width: 100%;
		height: 310upx;
	}
	.zai-title{
		position: absolute;
		top: 0;
		line-height: 360upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
	}
	.zai-form{
		margin-top: 200upx;
	}
	.zai-input{
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
		height: 36px;
	}
	.input-placeholder, .zai-input{
		color: #94afce;		
	}
	.zai-label{
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}
	.btn-group{
		text-align:center;
	}
	.cu-btn{
		margin-top: 100upx;
		border: 0;
		border-radius: 100upx;
		font-size: 40upx;
	}
	.zai-btn:after{
		border: 0;
	}
	/*按钮点击效果*/
	.zai-btn.button-hover{
		transform: translate(1upx, 1upx);
	}

</style>
