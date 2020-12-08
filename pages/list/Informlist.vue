<template>
	<view class="padding-top">
			<view class="card-menu cu-list menu" @tap="newInform">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新建通知事项
					</view>
				</view>
			</view>
			<view class="card-menu cu-list menu">
				<view class="cu-item">
					<view class="content" >
						<text class="text-green cuIcon-roundrightfill padding-left-sm"></text>对方已读:{{readornotdict.readcount}}条
						<text class="text-red text-bold padding-left-sm"> | </text>
						<text class="text-red cuIcon-roundrightfill padding-left-sm"></text>对方未读:{{readornotdict.notreadcount}}条 		
					</view>
				</view>
			</view>
			<view class="card-menu cu-list menu">
				<view class="cu-item">
				<view class="title">显示已读</view>
				<switch @change="SwitchA" :class="switchA?'checked':''" :checked="switchA?true:false"></switch>
				</view>
			</view>
			<scroll-view id="scroll" scroll-y = "true" :style="{height:scrollHeight}">
				<view class="cu-list menu card-menu margin-top-sm">
					<view v-for="(item,i) in datalist" :key="i" class="cu-item" @tap="confirmInform(item.informid)">
						<view class="content padding-tb-sm">
							<view>通知人：{{item.informname}}</view>
							<view class="text-gray ">
								 通知内容：{{item.informdata}}
							</view>
							<view class="text-gray ">
								 通知时间：{{item.createtime}}
							</view>
						</view>
						<view class="action">
							<view class="cu-tag round bg-gradual-green">确认</view>
						</view>
					</view>
				</view>
			</scroll-view>
	</view>
</template>

<script>
	// import yealuoInputs from '@/components/yealuo-select/yealuo-select.vue'
	import zhilinPicker from "@/components/zhilin-picker/zhilin-picker.vue"

	var api = require('@/common/api.js')	
	export default {
		components: {
		   //          yealuoInputs,
					 zhilinPicker,
		        },
		onReady() {
			this.loadInform(0);
		},
		data() {
			return {
				date: '2020-12-',
				show: false,
				title: '选择人员',
				openid:'',
				informopenid:'',
				datalist:'',
				scrollHeight:'',
				readornotdict:'',
				
			}
		},
		onLoad() {
			// 获取公司的所有用户
		},
		methods: {
			
			SwitchA(e) {
				this.switchA = e.detail.value
				if(this.switchA){
					// 1显示已读
					this.loadInform(1);
				}else{
					// 0显示未读
					this.loadInform(0);
				}
				console.log(this.switchA)
			},
			onPullDownRefresh() {
				this.loadInform();			
				uni.stopPullDownRefresh();
			},
			loadInform(informstate){
				api.get({
					url: 'searchinform',
					data: {
						openid:uni.getStorageSync('openid'),
						informstate        :informstate,
						// device_type : api.DeviceType
					},
					method: 'GET',
					header: {
					    'content-type': 'application/json'
					},
					success: (res) => {
						console.log(res)
						if (res != "") {
							this.datalist = res.datalist;
							this.readornotdict=res.readornotdict
							this.loading = false;
						}
						if (res == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '无未读通知'
							});
						}
					}
				});	
			},
			newInform(){
				uni.navigateTo({
					url: '../ucenter/newinform'
				});
			},
			confirmInform(informid){
				api.get({
					url: 'modinformState',
					data: {
						openid:uni.getStorageSync('openid'),
						informid        :informid,
						// device_type : api.DeviceType
					},
					method: 'GET',
					header: {
					    'content-type': 'application/json'
					},
					success: (res) => {
						if (res != "") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: 'success'
							});
							//强制页面重载，跳转到首页
							uni.redirectTo({url: 'Informlist'});
						}
						if (res == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '确认失败'
							});
						}
					}
				});	
			},				
		}
	}
</script>

<style lang="scss">
	.evan-form-show {
		padding: 0 30rpx;

		.form-input {
			font-size: 28rpx;
			color: #333;
			text-align: right;
		}

		.form-input-placeholder {
			font-size: 28rpx;
			color: #999
		}

		&__button {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			font-size: 36rpx;
			color: #fff;
			margin-top: 20rpx;
			background-color: #4790EF;

			&::before,
			&::after {
				border: none;
			}
		}

		.customize-form-item {
			&__label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
			}

			&__radio {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				&__text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>
