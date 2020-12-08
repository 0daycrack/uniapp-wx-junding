<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新增订单
					</view>
				</view>
				<view class="cu-form-group " v-if="false">
					<view class="title">订单编号<text class="text-red"></text></view>
					<input placeholder="交易编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>
				<view class="cu-form-group "@tap="show = true">
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
				<view class="cu-form-group "@tap="show1 = true">
					<view class="title">选择商品️</view>
					<text class="text-red">*</text>
					<input placeholder="点击选择商品" name="stock" v-model="stockname" disabled="disabled"></input>
					<zhilin-picker
							v-model="show1"
							:title="title1"
							:data="datalist1"
							:multiple="false"
							:initSelected="initSelected"
							:showSearch="true"
							@change="onChangeStock"
							@confirm="onConfirmStock"
							
							
					/>
				</view>
				<view class="cu-form-group ">
					<view class="title">剩余数量</view>
					<text class="text-red">*</text>
					<input placeholder="选择库存后显示剩余数量" name="stockremain" type="number" v-model="stockremain" disabled="disabled"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">订单状态</view>
					<text class="text-red">*</text>
					<picker @change="PickerChange" :value="inout" :range="picker" name='orderstate'>
						<view class="picker">
							{{inout>-1?picker[inout]:'请选择发货状态'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group ">
					<view class="title">销售数量</view>
					<text class="text-red">*</text>
					<input placeholder="请输入个数" name="ordernumber" type="number"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">是否为定金</view>
					<text class="text-red">*</text>
					<picker @change="MoneyPickerChange" :value="moneyindex" :range="moneypicker" name='moneytype'>
						<view class="picker">
							{{moneyindex>-1?moneypicker[moneyindex]:'请选择是或否'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group" v-if="showdeposit">
					<view class="title">定金金额</view>
					<text class="text-red">*</text>
					<input placeholder="请输入定金金额" name="orderdeposit" type="digit" v-model="orderdeposit"></input>
				</view>
				<view class="cu-form-group" v-if="showallmoney">
					<view class="title">销售金额</view>
					<text class="text-red">*</text>
					<input placeholder="请输入销售金额" name="ordermoney" type="digit" v-model="ordermoney"></input>
				</view>
				<view class="cu-form-group ">
					<view class="title">日期选择</view>
					<picker mode="date" :value="date" start="2000-01-01" end="2999-12-31" @change="DateChange">
						<view class="picker">
							{{date}}
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
				date: '2020-01-01',
				inout: -1,
				moneyindex:-1,
				showdeposit:false,
				showallmoney:false,
				picker: ['未发货','已发货'],
				moneypicker: ['是','否'],
				datalist:[{label:"无客户数据",value:"x"}],
				datalist1:[{label:"3333",value:"33"}],
				show: false,
				show1: false,
				title: '选择客户',
				title1:'选择商品',
				customerid:'',
				customername:'',
				stockid:'',
				stockname:'',
				stockremain:'',
				stockmoney:'',
				newstockremain:'',
				ordernumber:'',
				ordermoney:0,
				orderdeposit:0,
				orderdepositflag:'',
				loading:false
			}
		},
		onLoad() {			
			api.get({
				url: 'searchstkonly',
				data: {
					userlevel:uni.getStorageSync('userlevel'),
					companyid:uni.getStorageSync('companyid'),
					openid:uni.getStorageSync('openid')
				},
				success: (res) => {
					// console.log(res.data);
					if (res!="") {
						this.datalist1 = res
						console.log(this.datalist1)														
					}else{
					uni.showToast({
						title: '无商品信息,请先添加库存',
						icon: "none",
						duration: 1000
					});
					this.datalist1 = '';
				}
				}
			});
			api.get({
				url: 'sconly',
				data: {
					userlevel:uni.getStorageSync('userlevel'),
					companyid:uni.getStorageSync('companyid'),
					openid:uni.getStorageSync('openid')
				},
				success: (res) => {
					// console.log(res.data);
					if (res!="") {
						this.datalist = res
						console.log(res)														
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
			onConfirmStock(val){
				console.log(val)
				this.stockid=val
				this.getStockRemain();
				console.log(this.stockremain)
			},			
			onChangeStock(val){
				console.log(val)
			},
			//  该函数用来获取库存剩余及库存单价
			getStockRemain(){
				api.get({
					url: 'getstockinfo',
					data: {
						stockid:this.stockid,
					},
					success: (res) => {
						// console.log(res.data);
						if (res!="") {
							this.stockremain = res['stocknumber']
							this.stockname = res['stockname']
							console.log(res)														
						}else{
						uni.showToast({
							title: '无库存信息',
							icon: "none",
							duration: 1000
						});
					}
					}
				});	
			},
			updateCustomerActive(val){
				api.get({
					url: 'updatecustomeractive',
					data: {
						 customerid : this.customerid,
						 customeractive:val,
					},
					success: (res) => {
						// console.log(res.data);
						if (res.code=="sucess") {
						}else{
						uni.showToast({
							title: '更改用户为已成交',
							icon: "none",
							duration: 1000
						});
					}
					}
				});	
			},
			updateStockRemain(){
				api.get({
					url: 'updatestockremain',
					data: {
						 stockid : this.stockid,
						 stocknumber:this.newstockremain,
					},
					success: (res) => {
						// console.log(res.data);
						if (res!="") {
							console.log(res)														
						}else{
						uni.showToast({
							title: '无客户信息',
							icon: "none",
							duration: 1000
						});
					}
					}
				});	
			},
			newBudget:function(orderid){
				api.get({
					url: 'budgetform',
					data: {        
						openid:uni.getStorageSync('openid'),
						companyid		:uni.getStorageSync('companyid'),
						trademethod		:this.stockname,
						tradetype 	     :"收入",
						trademode        :"订单",
						trademoney      :this.ordermoney,
						tradedeposit   :this.orderdeposit,
						desc        : "此收入为关联订单的收入",
						orderid :orderid
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
			},
			getBackVal:function(e){
			    console.log(e)
			            },
			DateChange(e) {
				this.date = e.detail.value
			},			
			PickerChange(e) {
				this.inout = e.detail.value
			},
			MoneyPickerChange(e) {
				this.moneyindex = e.detail.value
				//定金
				if(this.moneyindex ==0){
					this.showallmoney=false
					this.showdeposit=true
				}
				if(this.moneyindex ==1){
					this.showallmoney=true
					this.showdeposit=false
				}
			},
			formSubmit(e){			
				var params = e.detail.value;
				if (params['orderstate'] == -1) {
					uni.showToast({
						title: '请选择订单状态',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['moneytype'] == -1) {
					uni.showToast({
						title: '请选择是否为定金',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['orderdate'] == '') {
					uni.showToast({
						title: ' 请选择下定日期',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['ordermoney'] == '') {
					uni.showToast({
						title: '请输入销售金额',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['ordernumber'] == '') {
					uni.showToast({
						title: '请输入销售数量',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (this.stockremain-params['ordernumber'] < 0 ) {
					uni.showToast({
						title: '销售数量大于库存数量',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading=true
				this.newstockremain=this.stockremain-params['ordernumber']
				console.log()
				console.log(params['ordermoney'],)
				api.get({
					url: 'orderform',
					data: {
						openid:uni.getStorageSync('openid'),
						customerid 	     : this.customerid,
						companyid		:uni.getStorageSync('companyid'),
						orderstate        :this.picker[params['orderstate']],
						orderdeposit	:this.orderdeposit,
						ordermoney      : this.ordermoney,
						ordernumber		:params['ordernumber'],
						orderdate       :this.date,
						orderremark        : params['desc'],
						orderdepositflag :this.moneypicker[this.moneyindex],
						stockid				:this.stockid
						// device_type : api.DeviceType
					},
					success: (res) => {						
						if (res.code=="success") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: '添加成功',
							});
							// 更新库存数量
							var orderid=res.orderid
							this.updateStockRemain();
							// 添加新的收支
							this.newBudget(orderid);
							// 更改用户状态为已成交
							this.updateCustomerActive(1);
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
							});
							setTimeout((e => {
								uni.navigateBack();
							}), 2500);
						}
						if (res.code=="failed") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: res['msg']
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
