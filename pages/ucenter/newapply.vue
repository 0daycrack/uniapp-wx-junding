<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新建上报申请
					</view>
				</view>
				<view class="cu-form-group" v-if="false">
					<view class="title">上报申请编号<text class="text-red"></text></view>
					<input placeholder="提醒事项编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>
				<view class="cu-form-group">
					<view class="title">上报申请内容</view>
					<text class="text-red">*</text>
					<input placeholder="请填写上报申请内容" name="applydata"></input>
				</view>
				<view class="cu-form-group"@tap="show = true">
					<view class="title">选择审核人️</view>
					<text class="text-red">*</text>
					<input placeholder="点击选择审核人️" name="openid" v-model="approvename" disabled="disabled"></input>
					<zhilin-picker
							v-model="show"
							:title="title"
							:data="datalist"
							:multiple="true"
							:initSelected="initSelected"
							:showSearch="true"
							@change="onChange"
							@confirm="onConfirm"
							@confirmlabel="onConfirmLabel"
					/>
				</view>
<!-- 				<view class="cu-form-group margin-top">
					<view class="title">提醒日期选择</view>
					<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
						<view class="picker">
							{{date}}
						</view>
					</picker>
				</view>	 -->	
				<view class="cu-form-group">
					<view class="title">备注信息</view>
					<input placeholder="备注" name="desc"></input>
				</view>

				<view class="cu-form-group">
					<button class="cu-btn bg-blue shadow" form-type="submit":loading="loading">提交信息</button>
				</view>
			</view>
			
		</form>
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
		data() {
			return {
				date: '2018-12-25',
				show: false,
				title: '选择人员',
				openid:'',
				applyname:'',
				approvename:'',
				applyopenid:'',
				datalist:'',
				loading:false,
				approveopenid:'',
			}
		},
		onLoad() {
			
			// 获取公司的所有用户
			api.get({
				url: 'searchsuperior',
				data: {
					openid:uni.getStorageSync("openid"),
					companyid: uni.getStorageSync("companyid"),
				},
				success: (res) => {
					// console.log(res.data);
					if (res!="") {
						this.datalist = res
					}else{
					uni.showToast({
						title: '无用户信息',
						icon: "none",
						duration: 1000
					});
					this.list = '';
				}
				}
			});
		},
		methods: {
			onConfirm(val){
				console.log(val)
				this.approveopenid=val
			},
			onChange(val){
				console.log(val)
			},
			onConfirmLabel(val){		
				this.approvename=val
				console.log(this.approvename)
			},
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['applydata'] == '') {
					uni.showToast({
						title: '请输入提醒内容',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if(this.approveopenid==""){
					uni.showToast({
						title: '请选择审核人️',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				 api.get({
					url: 'applyform',
					data: {
						applyopenid:uni.getStorageSync('openid'),
						approveopenid        :this.approveopenid,
						applystate 	:0,
						applydata       :params['applydata'],
						// device_type : api.DeviceType
					},
					success: (res) => {
						if (res.code=="success") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '新增申请成功'
							});
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
								//url: '../grid/grid'
							});
							setTimeout((e => {
								uni.navigateBack();
							}), 2500);
						}
						if (res.code == "failed") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '添加失败'
							});
						}
					}
				});			
			}				
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
