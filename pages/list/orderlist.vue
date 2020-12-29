<template>
	<view>
		<uni-calendar ref="calendar"  :insert="false" :lunar="true" :startDate="'2020-01-01'"
		 :endDate="'2025-12-31'" :range="true" @confirm="onSelected" />
		<!-- <mx-datepicker :show="showPicker" type="range" @confirm="onSelected" :show-seconds="true" @cancel="onCancel" /> -->
		<view class="cu-bar search bg-white shadow" id="search">
			<view class="padding-left-sm">
				<picker :range="searchType" @change="change">
					<view style="display: flex;align-items: center;">{{searchType[index]}}
						<text class="cuIcon-triangledownfill" style="font-size: 16px;height: 16px;padding-left: 1upx;"></text>
					</view>
				</picker>
			</view>
			<view class="search-form round" v-if="index < 1">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" v-model="search_text" :adjust-position="false" type="text" placeholder="请输入搜索内容" confirm-type="search">
			</view>
			<view class="search-form round flex justify-center" v-else-if ="index == 1">
				<view style="border-bottom: 1px solid #d1d1d1;padding-left: 20upx;"
				 @tap="openCalendar">{{startDate}} </view>
				<text style="padding: 0 10px;">至</text>
				<view style="border-bottom: 1px solid #d1d1d1;padding-left: 20upx;"
				 @tap="openCalendar">{{endDate}} </view>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @tap="searchSubmit">搜索</button>
			</view>
		</view>
		<scroll-view id="scroll" scroll-y = "true" :style="{height:scrollHeight}">
			<view class="cu-list menu card-menu margin-top-sm">
				<navigator v-for="(item,i) in list" :key="i" class="cu-item" :url="'../detail/orderdetail?orderid=' + item.orderid">
					<view class="content padding-tb-sm ">
						<view class="cu-capsule radius">
							<view class="cu-tag bg-red">订单状态</view>
							<view class="cu-tag line-cyan" v-if="item.ordercomplete=='0'">未完成</view>
							<view class="cu-tag line-red" v-if="item.ordercomplete=='1'">已完成</view>
							
						</view>
						<!-- <view class="bottom-state-nc" v-if="item.ordercomplete=='0'">订单状态：未完成</view>
						<view class="bottom-state-c" v-if="item.ordercomplete=='1'">订单状态：已完成</view> -->
						<view class="cuIcon-peoplelist">
							  客户姓名：{{item.customername}}
						</view>
						<view class="cuIcon-goodsfavor text-gray">
							 商品名称：{{item.stockname}}
						</view>
						<view class="cuIcon-order  text-gray ">
							 订单数量：{{item.ordernumber}}
						</view>
						<view class="cuIcon-recharge text-gray ">
							 订单金额：{{item.ordermoney}}
						</view>
						<view class="cuIcon-time text-gray ">
							 下订日期：{{item.orderdate}}
						</view>
						<view class="cuIcon-post text-gray ">
							 订单备注：{{item.orderremark}}
						</view>
					</view>
					<view class="action">
						<view class="cu-tag round bg-orange">详情</view>
					</view>
				</navigator>
			</view>
		</scroll-view>

		
	</view>
</template>

<script>
	var api = require('@/common/api.js');		
	import MxDatepicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';	
	export default {
		data() {
			return {
				customerid:'',
				customername:'',
				startDate:'开始日期',
				endDate:'结束日期',
				InputBottom:0,
				index:0,
				showPicker:false,
				searchType: ['客户名称', '日期范围'],				
				scrollHeight:'',
				list:[],
				search_text:''
			}
		},
		components: {
			MxDatepicker,uniCalendar
		},
		onReady() {
			let _this = this;
			let segmented = uni.createSelectorQuery().select("#search");
			let sysinfo = uni.getSystemInfoSync();
			let Height = sysinfo.windowHeight;
			segmented.boundingClientRect(data=>{
				console.log(data);
				let sH = (Height - data.top - 46).toFixed();
				_this.scrollHeight = sH+'px';
				console.log(_this.scrollHeight);
			}).exec();
		},
		onShow(){
					if(uni.getStorageSync('customerid')!=""){
						console.log(uni.getStorageSync('customerid'))
						api.get({
							url:'sobycustomer',
							data: {
								customerid:uni.getStorageSync('customerid'),
								companyid:uni.getStorageSync('companyid'),
								openid:uni.getStorageSync('openid'),
								level:uni.getStorageSync('userlevel'),
								customername: '',
								orderid: ''
							},
							success: (res) => {
								// console.log(res.data);
								if (res!="") {
									this.list = res
									console.log(res)														
								}else{
								uni.showToast({
									title: '无订单信息',
									icon: "none",
									duration: 1000
								});
								this.list = '';
							}
							//清空customerid
							uni.setStorageSync("customerid","")
							uni.showToast({
								title:"【"+this.list[0].customername+"】"+"订单"
							})
							}
						});
					}else{
						console.log("加载全部客户")
						api.get({
							url: 'searchorder',
							data: {
								companyid:uni.getStorageSync('companyid'),
								openid:uni.getStorageSync('openid'),
								level:uni.getStorageSync('userlevel'),
								customername: '',
								orderid: ''
							},
							success: (res) => {
								// console.log(res.data);
								if (res!="") {
									this.list = res
									console.log(res)														
								}else{
								uni.showToast({
									title: '无订单信息',
									icon: "none",
									duration: 1000
								});
								this.list = '';
							}
							}
						});	
					}
						
		
		},
		methods: {
			change: function(e) {
				this.index = e.detail.value;
				if (this.index === 1) {
					this.openCalendar();
				}
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			onCancel:function(){
				this.showPicker = false
			},
			onSelected(data) {
				if(data.range.after === ""){
					uni.showToast({
						title: '温馨提示,请选择正确的时间范围',
						icon: "none",
						duration: 1000
					});
					return false;
				}
				this.startDate = data.range.before;
				this.endDate = data.range.after;
				console.log(data);
			},
			searchSubmit(){
				let index = this.index;
				let params = {};
				params.type = index;  //获取picker的索引值，用于下面判断是日期还是关键字				
				//params.shequ_id = uni.getStorageSync('shequ').shequ_id;
				if(index < 1 ){  //坑爹啊，判断应该用 == 而不是 ===，否则picker变，搜索框内容不变
					//选择订单号
					//选择客户名称
					if(index == 0){
						this.customername=this.search_text;
					};
					params.text = this.search_text;
					api.get({
						url: 'searchorder',
						data: {
							customername: this.customername,
							orderid: this.orderid,
							openid:uni.getStorageSync('openid'),
							level:uni.getStorageSync('userlevel'),
							companyid:uni.getStorageSync('companyid'),
							
						},
						success: (res) => {
							// console.log(res.data);
							if (res!="") {
								this.list = res
							}else{
							uni.showToast({
								title: '用户不存在',
								icon: "none",
								duration: 1000
							});
							this.list = '';
							this.orderid = '';
							this.customername = '';
						}
							if (res == "") {
								this.loading = false;
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: '查找失败'
								});
							}
						}
					});	
				}else if(index == 1){  
					params.start_time = this.startDate;
					params.end_time = this.endDate;
					api.get({
					url: 'searchorderbydate',
					data: {									
						start_time : params.start_time,
						end_time   : params.end_time,
						openid:uni.getStorageSync('openid'),
						level:uni.getStorageSync('userlevel'),
						companyid:uni.getStorageSync('companyid'),
					},
					success: data => {
						console.log(data);
						if (data!="") {
							this.list = data;												
						}else{
							uni.showToast({
								title: '订单不存在',
								icon: "none",
								duration: 1000
							});
							this.list = '';							
						}
					}
				});
				}								
			},
			openCalendar(){
				this.$refs.calendar.open();
			}
		},		
		//下拉刷新
		// onPullDownRefresh() {
		// 	page = 1
		// 	reachbottom = true
		// 	this.listData = []
		// 	this.getList()

		// },
		// 加载更多
		// onReachBottom: function() {
		// 	if (reachbottom) {
		// 		this.getList();
		// 	}
		// }
	}
</script>

<style>
	.bottom-state-nc{
		border-bottom: 5rpx solid #f81714;
		border-bottom-right-radius: inherit;
		/* border-radius: 10rpx; */
		padding-bottom: 10rpx;
	}
	.bottom-state-c{
		border-bottom: 5rpx solid #9aff66;
		border-bottom-right-radius: inherit;
		/* border-radius: 10rpx; */
		padding-bottom: 10rpx;
	}
</style>
