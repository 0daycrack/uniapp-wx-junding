<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新增收支
					</view>
				</view>
				<view class="cu-form-group " v-if="false">
					<view class="title">交易编号<text class="text-red"></text></view>
					<input placeholder="交易编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>				
				<view class="cu-form-group ">
					<view class="title">收支选择</view>
					<text class="text-red">*</text>
					<picker @change="PickerChange" :value="inout" :range="picker" name='iosel'>
						<view class="picker">
							{{inout>-1?picker[inout]:'请选择收入或支出'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">收支分类</view>
					<text class="text-red">*</text>
					<picker @change="InOutFilterChange" :value="inoutValue" :range="ioFilterRange"  name='iofilter'>
						<view class="picker">
							{{inoutValue>-1?ioFilterRange[inoutValue]:'请选择收入或支出的类别'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">收支金额</view>
					<text class="text-red">*</text>
					<input placeholder="单位:元" name="iomoney" type="digit"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">支付方式</view>
					<text class="text-red">*</text>
					<picker @change="IoTypeChange" :value="typeindex" :range="typerange"  name='iotype'>
						<view class="picker">
							{{typeindex>-1?typerange[typeindex]:'请选择支付方式'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">备注信息</view>
					<input placeholder="备注" name="desc"></input>
				</view>

				<view class="cu-form-group ">
					<button class="cu-btn bg-blue shadow" form-type="submit":loading="loading">提交信息</button>
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
				typeindex:-1,
				inout: -1,
				inoutValue:-1,
				picker: ['收入','支出'],
				income: ['货款', '其他'],
				typerange: ['微信','支付宝','现金'],
				outcome:['日常支出','报销支出','交税支出','进货支出','活动支出','礼品支出'],
				ioFilterRange:[],
				loading:false,
			}
		},
		onLoad() {			
			
		},
		methods: {
			PickerChange(e) {
				this.inout = e.detail.value
				console.log(this.inout)
				if(this.inout==0){
					this.ioFilterRange=this.income
				};
				if(this.inout==1){
					this.ioFilterRange=this.outcome
				}
			},
			InOutFilterChange(e){
				this.inoutValue=e.detail.value
			},
			IoTypeChange(e){
				this.typeindex=e.detail.value
			},
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['iosel'] == -1) {
					uni.showToast({
						title: '请选择收入或者支出',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['iofilter'] == '') {
					uni.showToast({
						title: ' 请选择收入或者支出的类别',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['iotype'] == '') {
					uni.showToast({
						title: '请选择支付方式',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['iomoney'] == '') {
					uni.showToast({
						title: '请输入具体金额',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true;
				api.get({
					url: 'budgetform',
					data: {        
						openid:uni.getStorageSync('openid'),
						companyid		:uni.getStorageSync('companyid'),
						trademethod		:this.typerange[params['iotype']],
						tradetype 	     : this.picker[params['iosel']],
						trademode        :this.ioFilterRange[params['iofilter']],
						trademoney      : params['iomoney'],
						//为了实现与订单类通用 api
						tradedeposit:0,
						// 此 orderid 为空,普通收支不关联订单
						orderid		:'',
						desc        : params['desc'],
						// device_type : api.DeviceType
					},
					success: (res) => {
						if (res!= "") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '添加成功'
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
						if (res == "") {
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
