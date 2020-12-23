<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>员工管理
					</view>
				</view>
				<view class="cu-form-group"@tap="show = true">
					<view class="title">选择员工️</view>
					<text class="text-red">*</text>
					<input placeholder="点击选择员工" name="openid" v-model="username" disabled="disabled"></input>
					<zhilin-picker
							v-model="show"
							:title="title"
							:data="datalist"
							:multiple="false"
							:initSelected="initSelected"
							:showSearch="true"
							@change="onChange"
							@confirm="onConfirm"
							@confirmlabel="onConfirmLabel"
					/>
				</view>
				<view class="cu-form-group">
					<view class="title">设置权限</view>
					<text class="text-red">*</text>
					<picker @change="PickerChange" :value="index" :range="picker" name='levellist'>
						<view class="picker">
							{{index>-1?picker[index]:'请选择用户的权限'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">备注信息</view>
					<input placeholder="备注" name="desc"></input>
				</view>

				<view class="cu-form-group">
					<button class="cu-btn bg-blue shadow" form-type="submit" :loading="loading">提交信息</button>
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
				index: -1,
				picker: [],
				datalist:[{label:"无客户数据",value:"x"}],
				show: false,
				title: '选择员工',
				userlevel: uni.getStorageSync("userlevel"),
				openid:'',
				username:'',
				loading:false,
			}
		},
		onLoad() {
			console.log(this.userlevel)
			if (this.userlevel==0){
				this.picker=['1','2','3','4','5','6']
			}
			if (this.userlevel==1){
				this.picker=['2','3','4','5','6']
			}
			if (this.userlevel==2){
				this.picker=['3','4','5','6']
			}
			if (this.userlevel==3){
				this.picker=['4','5','6']
			}
			api.get({
				url: 'searchwxuser',
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
			onChange(val){
				console.log(val)
			},
			onConfirm(val){
				console.log(val)
				this.openid=val
			},
			onConfirmLabel(val){
				this.username=val
			},
			getBackVal:function(e){
			    console.log(e)
			            },
			DateChange(e) {
				this.date = e.detail.value
			},			
			PickerChange(e) {
				this.index = e.detail.value

			},
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['levellist'] == -1) {
					uni.showToast({
						title: '请选择用户等级',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (this.openid == '') {
					uni.showToast({
						title: '请选择用户',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				api.get({
					url: 'updateuserlevel',
					data: {
						openid: uni.getStorageSync("openid"),
						useropenid: this.openid,
						newlevel        :this.picker[params['levellist']],
						// device_type : api.DeviceType
					},
					success: (res) => {
						console.log(res)
						if (res =="success") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '更改成功'
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
						if (res == "failed") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '达到上限,更改失败'
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
