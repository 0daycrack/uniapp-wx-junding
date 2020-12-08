<template>
	<view class="padding-top">
		<view class="card-menu cu-list menu" >
			<view class="cu-item "@tap="newApply" v-if="userlevel>2">
				<view class="content">
					<text class="text-orange cuIcon-roundrightfill"></text>新建上报申请
				</view>
			</view>
			<view class="cu-item "v-else>
				<view class="content">
					<text class="text-orange cuIcon-roundrightfill"></text>上报审批
				</view>
			</view>
		</view>
		<view class="card-menu cu-list menu">
			<view class="cu-item ">
				<view class="content">
					<scroll-view scroll-x class="bg-white nav">
						<view class="flex text-center">
							<view class="cu-item flex-sub" :class="0==TabCur?'text-orange cur':''" @tap="tabSelect" :data-id="0">
								未审批
							</view>
							<view class="cu-item flex-sub" :class="1==TabCur?'text-orange cur':''" @tap="tabSelect" :data-id="1">
								已审批
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 设置循环 -->
			<view v-for="(item,i) in datalist" :key="i" class="cu-item">
				<view class="content padding-tb-sm" v-if="userlevel>2">
					<view>审批人：{{item.name}}</view>
					<view class="text-gray ">
						审批内容：{{item.applydata}}
					</view>
					<view class="text-gray ">
						申请时间：{{item.createtime}}
					</view>
				</view>
				<view class="content padding-tb-sm" v-else>
					<view>申请人：{{item.name}}</view>
					<view class="text-gray ">
						申请内容：{{item.applydata}}
					</view>
					<view class="text-gray ">
						申请时间：{{item.createtime}}
					</view>
				</view>
				<view class="action">
					<view class="cu-tag round bg-gradual-orange" v-if="item.applystate==0&userlevel>2">待审批</view>
					<view class="cu-tag round bg-gradual-orange" v-if="item.applystate==0&userlevel<=2" @tap="chooseApplyState(item.applyid)">审批</view>
					<view class="cu-tag round bg-gradual-green" v-if="item.applystate==1">已同意</view>
					<view class="cu-tag round bg-gradual-red" v-if="item.applystate==2">已拒绝</view>
				</view>
			</view>
		</view>
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
			this.loadApply(0);
		},
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				date: '2020-12-01',
				show: false,
				title: '选择人员',
				openid: '',
				informopenid: '',
				datalist: '',
				scrollHeight: '',
				readornotdict: '',
				userlevel:uni.getStorageSync("userlevel")

			}
		},
		onLoad() {
			// 获取公司的所有用户
		},
		methods: {
			tabSelect(e) {
				console.log(this.TabCur)
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.loadApply(this.TabCur)
				
			},
			onPullDownRefresh() {
				this.loadInform();
				uni.stopPullDownRefresh();
			},
			loadApply(applystate) {
				uni.showLoading({
					title:"加载数据中"
				})
				api.get({
					url: 'searchapply',
					data: {
						openid: uni.getStorageSync('openid'),
						applystate: applystate,
						// device_type : api.DeviceType
					},
					success: (res) => {
						console.log(res)
						if (res != "") {
							this.datalist = res;
							uni.hideLoading()
						}
						if (res == "") {
							this.datalist=""
							uni.hideLoading()
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '无申请'
							});
						}
					}
				});
			},
			newApply() {
				uni.navigateTo({
					url: '../ucenter/newapply'
				});
			},
			chooseApplyState(applyid){
				var _this=this
				uni.showModal({
				    title: '审批确认',
				    content: '是否要通过该申请?',
					cancelText:"拒绝",
					cancelColor:"#fd6054",
					confirmText:"通过",
					confirmColor:"#6fc877",
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户确定通过');
							_this.confirmApply(applyid,1);
				
				        } else if (res.cancel) {
				            console.log('用户拒绝通过');
							_this.confirmApply(applyid,2);
				        }
				    }
				});
			},
			confirmApply(applyid,applystate) {
				api.get({
					url: 'modapplystate',
					data: {
						openid: uni.getStorageSync('openid'),
						applyid: applyid,
						applystate:applystate
						// device_type : api.DeviceType
					},
					success: (res) => {
						if (res.code== "success") {
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '审批成功'
							});
							 
						}
						if (res == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '审批失败'
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
