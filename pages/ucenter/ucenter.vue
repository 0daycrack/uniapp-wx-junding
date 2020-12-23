<template>
	<view>
		<view class="header">
			<view class="bg">
				<view class="box">
					<view class="box-hd">
						<view class="avator">
							<!-- <image :src="userinfo.avatar ? userinfo.avatar : '../../static/toux.jpg'" @tap="avatar"></image> -->
							<image :src="avatar ? avatar : '../../static/toux.jpg'" @tap="avatar"></image>
						</view>
						<view class="text-white phone-number">当前用户:{{user_nickname ? user_nickname : "未设置昵称"}}(等级{{user_level}})</view>
						<view class="text-white phone-number">公司ID:{{companyid}}</view>
						
					</view>
					<view class="box-hd">
					</view>
					<view class="box-bd">
						<navigator url="u_user_info" class="item">
							<view class="icon"><img src="../../static/user/product.png"></view>
							<view class="text-white">员工信息</view>
						</navigator>
						<navigator url="./u_user_mangage" class="item">
							<view class="icon"><img src="../../static/user/customer.png"></view>
							<view class="text-white">权限管理</view>
						</navigator>
						<navigator url="../list/u_company_list" class="item">
							<view class="icon"><img src="../../static/user/supplier.png"></view>
							<view class="text-white">公司管理</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<!-- <image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607014005766&di=860efaaadc9ed12290fa6911538c8d36&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F439279305a3b599c8c5c0f21657958637963e03f7f373d-J4XNDh_fw192" mode="scaleToFill" class="gif-black response" style="height:100upx"></image> -->
		<view class="list-content margin-top-sm">
			<!-- <view class="list">
				<view class="li noborder" >
					<view class="icon"><image src="../../static/user/edition.png"></image></view>
					<view class="text">当前版本</view>
					<view class="to">
						<text>v2.0.0</text>
					</view>
				</view>
			</view> -->
			<view class="list">
				<!--<view class="li " @click="changeSkin">
					<view class="icon"><image src="../../static/user/skin.png"></image></view>
					<view class="text">主题切换</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>-->
				<navigator url="../table/locationtable" class="li " >
					<view class="icon"><image src="../../static/qiandao.png"></image></view>
					<view class="text">打卡记录</view>
					<image class="to" src="../../static/user/to.png"></image>
				</navigator>
				<navigator url="../table/tasktable" class="li " >
					<view class="icon"><image src="../../static/renwu.png"></image></view>
					<view class="text">任务记录</view>
					<image class="to" src="../../static/user/to.png"></image>
				</navigator>
				<navigator url="help_u" class="li " >
					<view class="icon"><image src="../../static/bangzhu.png"></image></view>
					<view class="text">帮助中心</view>
					<image class="to" src="../../static/user/to.png"></image>
				</navigator>
				<navigator url="about_us" class="li " >
					<view class="icon"><image src="../../static/user/about.png"></image></view>
					<view class="text">关于我们</view>
					<image class="to" src="../../static/user/to.png"></image>
				</navigator>
				<view class="li "  @tap="logout">
					<view class="icon"><image src="../../static/shuaxin.png"></image></view>
					<view class="text">刷新个人数据</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<view class="li noborder" @click="setting">
					<view class="icon"><image src="../../static/user/set.png"></image></view>
					<view class="text">系统设置</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</view>
		</view>
	</view>	
</template>
<script>
	var api = require('@/common/api.js');	
	import {version} from 'utils/config.js';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';	
	export default {		
		components: {tkiQrcode},
		data() {
			return {
				userinfo: "",
				user_nickname:"",
				user_level:"",
				avatar: "../../static/toux.jpg",
				version:'',
				companyid:'',
				src: '', // 二维码生成后的图片地址或base64
				foreground: '#000000', // 前景色
				pdground: '#66ccff', // 角标色
				background:'#ffffff',
				shequ:{},
				type:0,
				val:''
			}
		},
		// 初始化时，加载用户状态，姓名，等级
		onLoad() {
			if (this.islogin()) {
				this.companyid = uni.getStorageSync('companyid');
				this.user_nickname= uni.getStorageSync('nickname');
				this.avatar= uni.getStorageSync('avatarurl');
				this.user_level=uni.getStorageSync('userlevel');
			} else {
				console.log("未登录");
			}			
			this.version = version;
			this.shequ = uni.getStorageSync('shequ');
			this.type = uni.getStorageSync('type');
			this.val = "https://www.zgnnet.com/aliapp/shequ?id="+uni.getStorageSync('shequ').shequ_id;
		},		
		methods: {
			qrR(res) {
				this.src = res
			},
			setting() {
				if (this.islogin()) {
					uni.navigateTo({
						url: '/pages/infomation/infomation'
					});
				}
			},
			SelectShequ(){
				uni.$once('shequ_select',function(res){
					if(res.type === 1){
						post(that.ali_app + 'today_data',{id:res.shequ_id,type:3}).then(res=>{
							uni.setStorageSync('shequ',res.data.shequ);
							this.shequ = res.data.shequ;
						});
					}
				});
				uni.navigateTo({
					url:'../index/shequ_list/shequ_list'
				})
			},
			//注销
			logout() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确定要退出登录？',
					success: function(res) {
						if (res.confirm) {
							uni.clearStorageSync()
							uni.reLaunch({
								url: '../wxauthorize/wxauthorize'
							});
							setTimeout((e => {
								uni.navigateBack();
							}), 500);
							// api.post({
							// 	url: 'user/public/logout',
							// 	method: 'POST',
							// 	success: (data) => {
							// 		uni.clearStorageSync()
							// 		that.userinfo = ''
							// 		//强制页面重载，跳转到登录页
							// 		uni.reLaunch({
							// 			url: '../login/login'
							// 		});
							// 	}
							// });
						} else if (res.cancel) {
							//console.log('用户点击取消')
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#181a2d;
		font-size: 30upx;
	}
	.header{
		background: #3f448a;
		height: 400upx;
		padding-bottom: 110upx;
		.bg{
			width: 100%;
			height:200upx;
			padding-top:100upx;
			background-color:#3f448a;
		}
	}	
	.box{
		width: 650upx;
		height: 275upx;
		border-radius: 20upx;
		margin: 0 auto;
		// background: #fff;
		background-image: url("https://jiawei.xr1228.com/media/jio.jpg");
		background-size:100%;
		box-shadow: 0 5upx 20upx 0upx rgba(106, 66, 227, 0.8); 
		.box-hd{
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: center;
			.avator{
				width: 160upx;
				height: 160upx;
				background: #fff;
				border: 5upx solid #fff;
				border-radius: 50%;
				margin-top: -80upx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.phone-number{
				width: 100%;
				text-align: center;
			}
		}
		.box-bd{
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: center;
			.item{
				flex: 1 1 auto;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: center;
				border-right: 1px solid #f1f1f1;
				margin: 15upx 0;
				&:last-child{
					border: none;
				}
				.icon{
					width: 60upx;
					height: 60upx;
					img{
						width: 100%;
						height: 100%;
					}
				}
				.text{
					width: 100%;
					text-align: center;
					margin-top: 10upx;
				}
			}
		}
	}
	.list-content{
		background: #181a2d;		
	}
	.list{
		width:100%;
		border-bottom:15upx solid  #181a2d;
		background: #181a2d;
		&:last-child{
			border: none;
		}
		.li{
			width:92%;
			height:100upx;
			padding:0 4%;
			border-bottom:1px solid rgb(243,243,243);
			display:flex;
			align-items:center;
		&.noborder{
			border-bottom:0
			}
			.icon{
				flex-shrink:0;
				width:50upx;
				height:50upx;
				image{
					width:50upx;
					height:50upx;
				}				
			}
			.text{
				padding-left:20upx;
				width:100%;
				color:#fffef5;				
			}
			.to{
				flex-shrink:0;
				width:40upx;
				height:40upx;
			}
		}
	}	
</style>
