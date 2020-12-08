<template>
	<view class="main" v-if="userlevel<6">
		<!-- <cover-image src = "../../static/bg.jpg"></cover-image> -->
		<view class="bghead"></view>
		<view class="main">
			<!--左侧小区名称 右侧新增登记-->
			<view id="head1" class="flex justify-around margin-top-sm ">
				<navigator url="../list/stocklist" class="flex align-center">					
					<view class="cuIcon-goodsnew text-white" style="font-size: 50upx"></view>
				</navigator>
				<view></view><view></view>
				<text class="text-white">{{companyname}}</text>
				<view></view><view></view>
				<navigator url="../list/budgetlist" class="flex align-center">
					<view>
						<view class="cuIcon-moneybag text-white text-bold" style="font-size: 50upx"></view>
					</view>
				</navigator>
			</view>
			<!--社区出行概况-->
			<view id="chuxing" class="flex  justify-center align-center margin-top-sm">
				<view class="head_box">
	
					<view class="flex justify-around text-df padding-top">
						<text class="cuIcon-info text-gray  text-bold">信息状态提醒</text>
						<!-- <text class="bg-gradual-purple">（公司：{{companyname}}）</text> -->
					</view>
					<view class="flex justify-around padding-top-xl">
						<view class="flex flex-direction align-center">
							<!-- <text class="text-orange text-bold">{{today.totalinstorage}}</text> -->
							<text class="text-red text-bold">{{locatestate ? locatestate : "未打卡"}}</text>
							<text class="text-cyan">打卡状态</text>
						</view>
						<view class="flex flex-direction align-center" @tap="inform">
							<text class="text-orange text-bold">{{informcount ? informcount : "暂无"}}</text>
							<text class="text-cyan">未读通知</text>
						</view>
						<view class="flex flex-direction align-center" @tap="inre">
							<text class="text-orange text-bold">{{applycount ? applycount : "暂无"}}</text>
							<text class="text-cyan">未处理申请</text>
						</view>
					</view>
				</view>
			</view>
			<!--两个功能按钮-->
			<view id="btn" class="flex justify-around margin-top-sm" v-if="userlevel<=3">
				<view class="btn-box bg-gradual-orange flex align-center justify-center" @tap="inbudget">
					<text class="text-xxl text-shadow">收支录入</text>
					<text class="cuIcon-moneybag padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
				<view class="btn-box bg-gradual-orange flex align-center justify-center"  v-if="userlevel<3" @tap="instock">
					<text class="text-xxl text-shadow">库存录入</text>
					<text class="cuIcon-goodsfill padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
			</view>
			<view id="btn2" class="flex justify-around margin-top-sm">
				<view class="btn-box bg-gradual-red flex align-center justify-center" @tap=" incustomer">
					<text class="text-xxl text-shadow">客户录入</text>
					<text class="cuIcon-friend padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
				<view class="btn-box bg-gradual-pink flex align-center justify-center"  v-if="userlevel<5" @tap="inorder">
					<text class="text-xxl text-shadow">订单录入</text>
					<text class="cuIcon-order padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
			</view>
			<view id="btn3" class="flex justify-around margin-top-sm">
				<view class="btn-box bg-gradual-blue flex align-center justify-center" @tap="inform">
					<text class="text-xxl text-shadow">通知事项</text>
					<text class="cuIcon-info padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
				<view class="btn-box bg-gradual-green flex align-center justify-center"  v-if="userlevel<5" @tap="reminder">
					<text class="text-xxl text-shadow">提醒事项</text>
					<text class="cuIcon-remind padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
			</view>
			<view id="btn4" class="flex justify-around margin-top-sm">
				<view class="btn-box bg-gradual-purple flex align-center justify-center"  v-if="userlevel<5"@tap="indaytask">
					<text class="text-xxl text-shadow">每日任务</text>
					<text class="cuIcon-tagfill padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
				<view class="btn-box bg-gradual-orange flex align-center justify-center" @tap="inlocation">
					<text class="text-xxl text-shadow">定位打卡</text>
					<text class="cuIcon-location padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>	
			</view>
			<view id="btn5" class="flex justify-around margin-top-sm">
				<view class="btn-box bg-gradual-pink flex align-center justify-center" @tap="inapply">
					<text class="text-xxl text-shadow">上报申请</text>
					<text class="cuIcon-pick padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
				<view class="btn-box bg-gradual-pink flex align-center justify-center" @tap="inpcustomer">
					<text class="text-xxl text-shadow">潜在客户</text>
					<text class="cuIcon-peoplelist padding-left-xs" style="font-size: 90upx;opacity: 0.2"></text>
				</view>
			</view>
		</view>		
	</view>
</template>
<script>
	var api = require('@/common/api.js');	
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
	export default {
		data() {
			return {
				current: 0,
				items: ['记录模块1', '记录模块2'],
				activeColor: '#66ccff',
				scrollHeight:'',
				today:{},
				shequ:{},
				logList:[],
				informcount:'',
				locatestate:'',
				companyname:'',
				applycount:'',
				token:'',
				userlevel:uni.getStorageSync('userlevel'),
			}
		},
		components: {
				uniSegmentedControl
				},
		onHide() {
			
		},
		onShow() {
			this.normalCheck();
		},
		onReady() {
			// this.normalCheck();
					},
		onLoad() {
			this.token = uni.getStorageSync('token');
			if(this.token){
				console.log("%s","用户Token",this.token)
				console.log("%s","用户设备",api.DeviceType)
			}else{
				console.log('无token信息,重新获取');
				uni.reLaunch({
					url:"../wxauthorize/wxauthorize"
				})
			}
									
		},		
		//下拉刷新
		onPullDownRefresh() {
			this.normalCheck();
			uni.showToast({
				title: '成功刷新数据',
				duration: 1500,
				icon: "none"
			});
			uni.stopPullDownRefresh();
		},		
		methods: {
			//日常检查
			normalCheck(){
				this.getInformCount();
				this.getLocationState();
				this.refreshUser();
				this.checkUpdate();
				this.checkSession();
				this.getApplyCount();
			},
			/**
			 * 加载今日数据
			 */
			checkSession(){
				uni.checkSession({
				  success () {
					  console.log("登录session 有效")
				    //session_key 未过期，并且在本生命周期一直有效
				  },
				  fail () {
				    // session_key 已经失效，需要重新执行登录流程
				    uni.reLaunch({
				    	url:"../wxauthorize/wxauthorize"
				    })//重新登录
				  }
				})
			},
			refreshUser(){		
				api.get({
					url: 'getuserinfo',
					data: {						
						openid:uni.getStorageSync('openid'),
					},
					success: data => {
						if(data!='0'){
							console.log("%s","用户数据",data);
							uni.setStorageSync('openid',data['openid'])
							uni.setStorageSync('companyid',data['companyid'])
							uni.setStorageSync('userlevel',data['level'])
							uni.setStorageSync('companyname',data['companyname'])
							this.companyname=uni.getStorageSync('companyname')
						}				
					}
				});
				this.userlevel=uni.getStorageSync("userlevel")
				console.log("%s","用户等级",this.userlevel);
			},
			checkUpdate: function() {
				const updateManager = uni.getUpdateManager();
				
				updateManager.onCheckForUpdate(function (res) {
				  // 请求完新版本信息的回调
				  console.log("%s","版本更新:",res.hasUpdate);
				});
				
				updateManager.onUpdateReady(function (res) {
				  uni.showModal({
				    title: '更新提示',
				    content: '新版本已经准备好，是否重启应用？',
				    success(res) {
				      if (res.confirm) {
				        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				        updateManager.applyUpdate();
				      }
				    }
				  });
				
				});
				
				updateManager.onUpdateFailed(function (res) {
				  // 新的版本下载失败
				});
			},
			getTime:function(){
				var date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
				minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
				second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				//var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
				var timer = year + '-' + month + '-' + day
			return timer;
			},
			getLocationState(){
				api.get({
					url: 'getlocatestate',
					data: {						
						openid:uni.getStorageSync('openid'),
						locatedate:this.getTime(),
					},
					success: data => {
						if(data!='0'){
							console.log("%s","用户打卡信息:",data);
							this.locatestate = '已打卡';	
						}				
					}
				});
			},
			getApplyCount(){
				api.get({
					url: 'getapplycount',
					data: {						
						openid:uni.getStorageSync('openid'),
						applystate:0,
					},
					success: data => {
						console.log("%s","用户上报信息:",data);
						this.applycount = data;						
					}
				});
			},
			getInformCount(){
				api.get({
					url: 'getinformcount',
					data: {						
						openid:uni.getStorageSync('openid'),
						informstate:0,
					},
					success: data => {
						console.log("%s","用户通知信息:",data);
						this.informcount = data;						
					}
				});
			},
			inpcustomer(){
				uni.navigateTo({
					url:'../ucenter/pcustomer'
				})
			},
			inapply(){
				uni.navigateTo({
					url:'../ucenter/apply'
				})
			},
			instock(){
				uni.navigateTo({
					url:'../ucenter/stock'
				})
			},
			indaytask(){
				uni.navigateTo({
					url:'../ucenter/daytask'
				})
			},
			reminder(){
				uni.navigateTo({
					url:'../ucenter/reminder'
				})
			},
			incustomer(){
				uni.navigateTo({
					url:'../ucenter/customer'
				})
			},
			inlocation(){
				uni.navigateTo({
					url:'../location/index/index'
				})
			},
			inbudget(){
				uni.navigateTo({
					url:'../ucenter/budget'
				})
			},
			instorage(){
				uni.navigateTo({
					url:'../instorage/instorage'
				})
			},
			inorder(){
				uni.navigateTo({
					url:'../ucenter/order'
				})
			},
			inform(){
				uni.navigateTo({
					url:'../list/Informlist'
				})
			},	
			outstorage(){
				uni.navigateTo({
					url:'../outstorage/outstorage'
				})
			},	
			// onClickItem(index) {
			// 	//console.log(index)
			// 	if (this.current !== index) {
			// 		this.current = index
			// 	}
			// 	if(index === 0){//入库记录
			// 		this.getList(1)
			// 	}else if(index === 1){ //出库记录
			// 		this.getList(2)
			// 	}
			// },
				
			/**
			 * 加载文章列表
			 */
			// getList(type){
			// 	console.log(type)
			// 	api.post({
			// 		url: 'wms/Index/instoragelog',
			// 		data: {						
			// 			state:type,
			// 			device_type: api.DeviceType
			// 		},
			// 		success: data => {
			// 			console.log(data);
			// 			this.logList = data.data;						
			// 		}
			// 	});
			// }			
		}
	}
</script>

<style>
	page{
		background-color: #181a2d;
	}
	cover-image {
		position: absolute;
		left: 0;
		top: 0;
		height: 300rpx;
		width: 100%;
	}
	.bghead{
		position: absolute;
		left: 0;
		top: 0;
		height: 300rpx;
		width: 100%;
		background-color: #3f448a;
	}	
	.main{
		position: absolute;
		top: 0;width: 100%;
	}
	.head_box{
		width: 700upx;
		height: 230upx;
		background-color: #2c305d;
		border-radius: 15upx;
	}
	.btn-box{
		width: 310upx;
		height: 150upx;
		border-radius: 20upx;
	}
	.scroll{
		height: 700rpx;
	}
	
	.swiper {
		height: 350upx;
	}

	.swiper-item {
		display: block;
		height: 350upx;
		width: 100%;
	}

	.uni-media-list-logo {
		width: 100upx;
		height: 100upx;
	}
	.scan-result {
		min-height: 50upx;
		line-height: 50upx;
	}
	.logbt {
		background: none;
		border: none !important;
		position: fixed;
		display: inline;
		margin-left: -76upx
	}

	.logbt:after {
		border: none !important;
	}

	image {
		width: 100upx;
		height: 100upx;
	}

	.landing {
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left, #86B5F4, #4790EF);
	}

	.login-btn {
		padding: 10upx 20upx;
		margin-top: 350upx;
	}

	.login-function {
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}

	.login-forget {
		float: left;
		font-size: 26upx;
		color: #999;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 26upx;

	}

	.login-input input {
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}

	.login-margin-b {
		margin-bottom: 25upx;
	}

	.login-input {
		padding: 10upx 20upx;
	}

	.login-head {
		font-size: 34upx;
		text-align: center;
		padding: 25upx 10upx 55upx 10upx;
	}

	.login-card {
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 120upx;
	}

	.login-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#86B5F4, #4790EF);
	}
</style>
