<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新增任务<text class="text-red text-sm padding-left-sm" @tap="newReminder">任务时间：{{date}}</text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title cuIcon-">任务编号</view>
					<input placeholder="任务编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>
				<view class="cu-form-group ">
					<input placeholder="请输入任务1" v-model="task1" name="task1"></input>
					<text class="text-red">|</text>
					<input placeholder="请输入期望值" v-model="ecvalue1" name="ecvalue1"></input>
				</view>
				<view class="cu-form-group ">
					<input placeholder="请输入任务2" v-model="task2" name="task2"></input>
					<text class="text-red">|</text>
					<input placeholder="请输入期望值" v-model="ecvalue2" name="ecvalue2"></input>
				</view>
				<view class="cu-form-group ">
					<input placeholder="请输入任务3" v-model="task3" name="task3"></input>
					<text class="text-red">|</text>
					<input placeholder="请输入期望值" v-model="ecvalue3" name="ecvalue3"></input>
				</view>	
				<view class="cu-form-group ">
					<input placeholder="请输入任务4" v-model="task4" name="task4"></input>
					<text class="text-red">|</text>
					<input placeholder="请输入期望值" v-model="ecvalue4" name="ecvalue4"></input>
				</view>
				<view class="cu-form-group ">
					<input placeholder="请输入任务5" v-model="task5" name="task5"></input>
					<text class="text-red">|</text>
					<input placeholder="请输入期望值" v-model="ecvalue5" name="ecvalue5"></input>
				</view>

				<view class="cu-form-group ">
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
				date: 'xxxx-xx-xx',
				show: false,
				title: '选择公司',
				customerid:'',
				task1:'',
				task2:'',
				task3:'',
				task4:'',
				task5:'',
				ecvalue1:'',
				ecvalue2:'',
				ecvalue3:'',
				ecvalue4:'',
				ecvalue5:'',
				loading:false
				
			}
		},
		onLoad() {
			this.date=this.getTime();
			this.loadTask();
			console.log("daymanage")
		},
		methods: {
			loadTask(){
				api.get({
					url: 'gettaskmanage',
					data: {
						companyid 	     : uni.getStorageSync('companyid'),
						taskdate      : this.date,
						// device_type : api.DeviceType
					},
					success: (res) => {
						console.log(res)
						if (res != null ) {
							this.loading = false;
							this.task1 = res['task1'],
							this.task2 = res['task2'],
							this.task3 = res['task3'],
							this.task4 = res['task4'],
							this.task5 = res['task5'],					
							this.ecvalue1 = res['ecvalue1'],
							this.ecvalue2 = res['ecvalue2'],
							this.ecvalue3 = res['ecvalue3'],
							this.ecvalue4 = res['ecvalue4'],
							this.ecvalue5 = res['ecvalue5'],							
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '加载今日历史数据'
							});
						}
						if (res == null) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '新增数据'
							});
						}
					}
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
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['remindertxt'] == '') {
					uni.showToast({
						title: '请输入提醒内容',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				 api.get({
					url: 'daytaskform',
					data: {
						openid:uni.getStorageSync('openid'),
						companyid 	     : uni.getStorageSync('companyid'),
						task1        :params['task1'],
						ecvalue1	 :params['ecvalue1'],
						task2        :params['task2'],
						ecvalue2	 :params['ecvalue2'],					
						task3        :params['task3'],
						ecvalue3	 :params['ecvalue3'],
						task4        :params['task4'],
						ecvalue4	 :params['ecvalue4'],
						task5        :params['task5'],
						ecvalue5	 :params['ecvalue5'],
						taskdate      : this.date,
					},
					success: (res) => {
						if (res != "") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '添加成功'
							});
							uni.reLaunch({
								url: '../index/index'
							});
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
