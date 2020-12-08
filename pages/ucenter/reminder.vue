<template>
	<view>
		<view class="card-menu cu-list menu">
			<view class="cu-item " @tap="newReminder">
				<view class="content" >
					<text class="text-orange cuIcon-roundrightfill" @tap="newReminder"></text>点击新增提醒<text class="text-gray text-sm padding-left-sm" @tap="newReminder">更新时间：{{List.modifytime}}</text>
				</view>
			</view>
		</view>
		<scroll-view id="scroll" scroll-y = "true" :style="{height:scrollHeight}">
			<view class="cu-list menu card-menu margin-top-sm">
				<navigator v-for="(item,i) in list" :key="i" class="cu-item">
					<view class="content padding-tb-sm">
						<view v-if="item.reminderstate=='0'">提醒状态：未提醒</view>
						<view v-if="item.reminderstate=='1'">提醒状态：已提醒</view>
						<view class="text-gray ">
							  提醒内容：{{item.reminderdata}}
						</view>
						<view class="text-gray ">
							 提醒备注：{{item.reminderremark}}
						</view>
						<view class="text-gray ">
							  提醒时间：{{item.reminderdate}}
						</view>
					</view>
	<!-- 				<view class="action">
						<view class="cu-tag round bg-orange">详情</view>
					</view> -->
				</navigator>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				list:[],
				templateId:'HbG9PzqnUC06eHhFWkCiD6kAaiAI_qILba-yLjE6lr0',
				
			}
		},
		onReady() {
		},
		onLoad(){
			api.get({
				url: 'searchreminder',
				data: {
					openid:uni.getStorageSync("openid")
				},
				method: 'GET',
				header: {
				    'content-type': 'application/json'
				},
				success: (res) => {
					// console.log(res.data);
					if (res!="") {
						this.list = res
					}else{
					uni.showToast({
						title: '无提醒,请新增',
						icon: "none",
						duration: 1000
					});
					this.list = '';
				}
				}
			});	
		},
		methods: {
			newReminder(){
				this.notify()
			},
			notify(){
				let templateId = this.templateId
				uni.requestSubscribeMessage({
				  tmplIds: [templateId],
				  success (res) {
					 console.log(res[templateId])
					 
					 if (res[templateId] == 'reject') {
						 uni.showToast({
						  	icon: 'none',
						  	title: '您拒绝了我明天就没提醒了哦',
						  	duration: 2000
						  });
						 return;
					 }
					 if (res[templateId] == 'ban') {
						 uni.showToast({
						 	icon: 'none',
						 	title: '请移步到设置打开订阅功能',
						 	duration: 2000
						 });
					    return;
					 }
					 if (res[templateId] == 'accept') {
						let token    = uni.getStorageSync('token')
						console.log(token)
						if(token!=""){
												 uni.navigateTo({
												 	url: '/pages/ucenter/newreminder'
												 })
						}
					 }

					 // 触发message
					 // api.get({
					 // 	url: 'getmessage',
					 // 	data: {        
					 // 		openid:uni.getStorageSync('openid'),
					 // 		template_id 	     : templateId,
					 // 		token        :token,
					 // 		// device_type : api.DeviceType
					 // 	},
					 // 	success: (res) => {
					 // 		if (res != "") {
					 // 			// this.loading = false;
					 // 			uni.showToast({
					 // 				duration: 500,
					 // 				icon: 'success',
					 // 				title: 'success'
					 // 			});
					 // 			//强制页面重载，跳转到首页
					 // 			uni.reLaunch({
					 // 				url: '/pages/index/index'
					 // 				//url: '../grid/grid'
					 // 			});
					 // 			setTimeout((e => {
					 // 				uni.navigateBack();
					 // 			}), 500);
					 // 		}
					 // 		if (res == "") {
					 // 			// this.loading = false;
					 // 			uni.showToast({
					 // 				duration: 1500,
					 // 				icon: 'none',
					 // 				title: '添加失败'
					 // 			});
					 // 		}
					 // 	}
					 // });
				  },
				  fail (res) {
				  	console.log(res)			  
				  }
				})
			}
		}
	}
</script>

<style>

</style>
