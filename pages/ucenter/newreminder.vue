<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新增提醒事项
					</view>
				</view>
				<view class="cu-form-group" v-if="false">
					<view class="title">提醒事项编号<text class="text-red"></text></view>
					<input placeholder="提醒事项编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>				
				<view class="cu-form-group">
					<view class="title">是否为打客户电话类的提醒</view>
					<switch @change="SwitchA" :class="switchA?'checked':''" :checked="switchA?true:false"></switch>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>

				<view class="cu-form-group" v-if="showCusPicker" @tap="show = true">
					<view class="title">选择客户️</view>
					<text class="text-red">*</text>
					<input placeholder="点击选择客户" name="customer" v-model="customername" disabled="disabled"></input>
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
					<view class="title">提醒事项内容</view>
					<text class="text-red">*</text>
					<input placeholder=" 请输入提醒事项内容" name="reminderdata"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">提醒日期选择</view>
					<text class="text-red">*</text>
					<input placeholder="请选择提醒日期" v-model="datetime" name="reminderdate" @click="onShowDatePicker('datetime')" disabled="disabled"></input>									            
				</view>	
				<view class="cu-form-group ">
					<view class="title">备注信息</view>
					<input placeholder="备注" name="reminderremark"></input>
				</view>

				<view class="cu-form-group ">
					<button class="cu-btn bg-blue shadow" form-type="submit":loading="loading">提交信息</button>
				</view>
			</view>
			
		</form>
		 <mx-date-picker :format="dateformate":show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'入住'" :end-text="'离店'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	// import yealuoInputs from '@/components/yealuo-select/yealuo-select.vue'
	import zhilinPicker from "@/components/zhilin-picker/zhilin-picker.vue"
    import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";

	var api = require('@/common/api.js')	
	export default {
		components: {
		            MxDatePicker,
					 zhilinPicker,
		        },
		data() {
			return {
                showPicker: false,
				type: 'datetime',
				dateformate:'yyyy-mm-dd hh:ii:ss',
                datetime: '2019/01/01 15:00:12',				
				show: false,
				title: '选择人员',
				customerid:'',
				customername:'',
				datalist:'',
				templateId:'HbG9PzqnUC06eHhFWkCiD6kAaiAI_qILba-yLjE6lr0',
				value: '',
				showCusPicker:false,
				loading:false
			}
		},
		onLoad() {
			this.datetime=this.getTime();
				api.get({
					url: 'sconly',
					data: {
						userlevel:uni.getStorageSync('userlevel'),
						companyid:uni.getStorageSync('companyid'),
						openid:uni.getStorageSync('openid')
					},
					success: (res) => {
						if (res!="") {
							this.datalist = res
						}else{
						uni.showToast({
							title: '无客户信息,请添加客户信息',
							icon: "none",
							duration: 1000
						});
						this.datalist = '';
					}
					}
				});	
		},
		methods: {
						SwitchA(e) {
							this.switchA = e.detail.value
							if(this.switchA){
								this.showCusPicker=true
							}else{
								this.showCusPicker=false
								// 清空 customerid
								this.customerid=""
								this.customername=""
							}
							console.log(this.switchA)
						},
			            onShowDatePicker(type){//显示
			                this.type = type;
			                this.showPicker = true;
			                this.value = this[type];
			            },
						onChange(val){
							console.log(val)
						},
						onConfirmLabel(val){
							this.customername=val
							console.log(val)
						},
						onConfirm(val){
							console.log(val)
							this.customerid=val
						},
			            onSelected(e) {//选择
			                this.showPicker = false;
			                if(e) {
			                    this[this.type] = e.value; 
			                    //选择的值
			                    console.log('value => '+ e.value);
								this.datetime=e.value
			                    //原始的Date对象
			                    console.log('date => ' + e.date);
			                }
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
				var timer = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
				// var timer = year + '/' + month + '/' + day 
			return timer;
			},
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['reminderdata'] == '') {
					uni.showToast({
						title: '请输入提醒内容',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				 api.get({
					url: 'reminderform',
					data: {
						openid:uni.getStorageSync('openid'),
						token 	     : uni.getStorageSync('token'),
						template_id        :this.templateId,
						reminderdate      : this.datetime,
						reminderdata       :params['reminderdata'],
						customerid			:this.customerid,
						reminderremark        : params['reminderremark'],
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
