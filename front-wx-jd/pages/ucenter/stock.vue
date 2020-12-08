<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新增库存
					</view>
				</view>
				<view class="cu-form-group" v-if="false">
					<view class="title">库存编号<text class="text-red"></text></view>
					<input placeholder="库存编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>				
				<view class="cu-form-group">
					<view class="title">库存名称<text class="text-red">*</text></view>
					<input placeholder="请输入库存名称" name="stockname"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">库存数量<text class="text-red">*</text></view>
					<input placeholder="请输入库存数量" name="stocknumber"></input>
				</view>
<!-- 				<view class="cu-form-group">
					<view class="title">库存单价<text class="text-red">*</text></view>
					<input placeholder="请输入库存单价" name="stockmoney"></input>
				</view> -->
				
				<view class="cu-form-group">
					<view class="title">备注信息</view>
					<input placeholder="备注" name="desc"></input>
				</view>

				<view class="cu-form-group ">
					<button class="cu-btn bg-blue shadow" form-type="submit" :loading="loading">提交信息</button>
				</view>
			</view>
			
		</form>
	</view>
</template>

<script>
	var api = require('@/common/api.js')	
	export default {
		
		data() {
			return {
				imgList: [],
				loading:false
			}
		},
		onLoad() {			
			
		},
		methods: {	
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['stockname'] == '') {
					uni.showToast({
						title: '库存名称不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['stocknumber'] == '') {
					uni.showToast({
						title: '库存数量不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				api.get({
					url: 'stockform',
					data: {        
						openid:uni.getStorageSync('openid'),
						companyid: uni.getStorageSync('companyid'),
						stockname 	     : params['stockname'],
						stockmoney        :0,
						stocknumber      : params['stocknumber'],
						stockremark        : params['desc'],
						// device_type : api.DeviceType
					},
					success: (res) => {
						if (res!="") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '成功'
							});
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
								//url: '../grid/grid'
							});setTimeout((e => {
								uni.navigateBack();
							}), 2500);
						}
						if (res == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '无数据'
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
