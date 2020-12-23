<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text> 公司管理
					</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">公司编号<text class="text-red"></text></view>
					<input placeholder="公司编号（无需填写）" name="companyid" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>
				<view class="cu-form-group "@tap="show = true">
					<view class="title">选择公司老板(1级)️</view>
					<text class="text-red">*</text>
					<input placeholder="点击选择客户" name="userid" v-model="username" disabled="disabled"></input>
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
				<view class="cu-form-group ">
					<view class="title">用户等级</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入用户等级" name="newlevel" default=1 type="number"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">公司名称</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入公司名称" name="companyname"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">一级数量</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入数量" name="l1count"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">二级数量</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入数量" name="l2count"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">三级数量</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入数量" name="l3count"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">四级数量</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入数量" name="l4count"></input>
				</view>	
				<view class="cu-form-group ">
					<view class="title">五级数量</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入数量" name="l5count"></input>
				</view>	
				<view class="cu-form-group ">
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
				datalist:[{label:"无用户数据",value:"null"}],
				show: false,
				title: '请选择公司老板',
				userid:'',
				userlevel:'',
				usercompanyid:'',
				companyid:'',
				username:'',
				loading:false
			}
		},
		onLoad() {
			 
			api.get({
				url: 'searchwxuser',
				data: {
					openid:uni.getStorageSync("openid"),
					companyid: "",
					userlevel:uni.getStorageSync("userlevel"),				
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
				this.userid=val
			},
			onConfirmLabel(val){
				this.username=val
			},
			getBackVal:function(e){
			    console.log(e)
			            },
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['comanyname'] == '') {
					uni.showToast({
						title: '请填写公司名称',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (this.userid == 'null') {
					uni.showToast({
						title: ' 请选择公司老板',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				api.get({
					url: 'companyform',
					data: {
						openid: this.userid,
						companyname      : params['companyname'],
						l1count       :params['l1count'],
						l2count       :params['l2count'],
						l3count       :params['l3count'],
						l4count       :params['l4count'],
						l5count       :params['l5count'],						
						companyremark        : params['desc'],
						// device_type : api.DeviceType
					},
					method: 'GET',
					header: {
					    'content-type': 'application/json'
					},
					success: (res) => {
						if (res != "") {
							this.usercompanyid=res['datainfo'];
							console.log(this.usercompanyid)
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: 'success'
							});
							// 更新id
							this.updateCompany();
						}
						if (res == "") {
							this.usercompanyid=res['datainfo'];
							console.log(this.usercompanyid)
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '添加失败'
							});
						}
					}
				});
				 api.get({
					url: 'updateuserlevel',
					data: {
						openid: uni.getStorageSync("openid"),
						useropenid: this.userid,
						newlevel      : params['newlevel'],
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
								title: 'success',
							});
							//强制页面重载，跳转到首页
						}
						if (res  == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '添加成功',
							});
						}
					}
				});
				console.log(this.usercompanyid)
			},
			updateCompany(){
				api.get({
					url: 'updateusercompany',
					data: {
						openid: this.userid,
						companyid      : this.usercompanyid						
					},
					success: (res) => {
						if (res != "") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: 'success',
							});
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
								//url: '../grid/grid'
							});
							setTimeout((e => {
								uni.navigateBack();
							}), 500);
							// uni.setStorageSync('upload', 1)
						}
						if (res  == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '添加失败',
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
