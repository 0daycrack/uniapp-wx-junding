<template>
	<view>
		<uni-calendar ref="calendar"  :insert="false" :lunar="true" :startDate="'2020-01-01'"
		 :endDate="'2025-12-31'" :range="true" @confirm="onSelected" />
		<!-- <mx-datepicker :show="showPicker" type="range" @confirm="onSelected" :show-seconds="true" @cancel="onCancel" /> -->
		<view class="cu-bar search bg-white" id="search">
			<view class="padding-left-sm">
				<picker :range="searchType" @change="change">
					<view style="display: flex;align-items: center;">{{searchType[index]}}
						<text class="cuIcon-triangledownfill" style="font-size: 16px;height: 16px;padding-left: 1upx;"></text>
					</view>
				</picker>
			</view>
			<view class="search-form round" v-if="index < 2">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" v-model="search_text" :adjust-position="false" type="text" placeholder="请输入搜索内容" confirm-type="search">
			</view>
			<view class="search-form round flex justify-center" v-else-if ="index == 2">
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
				<navigator v-for="(item,i) in list" :key="i" class="cu-item" :url="'../detail/stockdetail?stockid=' + item.stockid">
					<view class="content padding-tb-sm">
						<view class="cuIcon-goodsnew">库存名称：{{item.stockname}}</view>
						<view class="cuIcon-order text-gray ">
							 库存数量：{{item.stocknumber}}
						</view>
						<view class="cuIcon-time text-gray ">
							 更新日期：{{item.modifytime}}
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
				userlevel:'',
				companyid:'',
				startDate:'开始日期',
				endDate:'结束日期',
				InputBottom:0,
				index:0,
				showPicker:false,
				searchType: ['库存名称', '库存类型', '添加日期'],				
				scrollHeight:'',
				list:[],
				search_text:'',

				
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
		onShow() {
			this.loadStock();
		},
		onLoad(){
			
		},
		methods: {
			loadStock:function(e){
				api.get({
					url: 'searchstock',
					data: {
						openid:uni.getStorageSync("openid"),
						stockname:'',
						userlevel:uni.getStorageSync("userlevel"),
						companyid:uni.getStorageSync("companyid")
					},
					success: (res) => {
						// console.log(res.data);
						if (res!="") {
							this.list = res
							console.log(res)														
						}else{
						uni.showToast({
							title: '库存不存在',
							icon: "none",
							duration: 1000
						});
						this.list = '';
					}
					}
				});	
			},
			change: function(e) {
				this.index = e.detail.value;
				if (this.index === 2) {
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
				uni.showLoading({
					title:"数据加载中"
				})
				if(index < 2 ){  //坑爹啊，判断应该用 == 而不是 ===，否则picker变，搜索框内容不变
					//选择客户来源
					if(index == 0){
						this.stockname=this.search_text;
					};
					//选择客户名称
					if(index == 1){
						// this.customername=this.search_text;
					};
					params.text = this.search_text;
					console.log(index);
					api.get({
						url: 'searchstock',
						data: {
							openid:uni.getStorageSync("openid"),
							stockname:this.stockname,
							companyid: uni.getStorageSync("companyid"),
							
						},
						success: (res) => {
							// console.log(res.data);
							if (res!="") {
								this.list = res
								uni.hideLoading();
								console.log(res)														
							}else{
							uni.showToast({
								title: '库存不存在',
								icon: "none",
								duration: 1000
							});
							this.list = '';
							this.customerfrom = '';
							this.customername = '';
						}
							if (res['code'] == "failed") {
								this.loading = false;
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: res.data.msg
								});
							}
						}
					});	
				}else if(index == 2){
					uni.showLoading({
						title: "数据加载中"
					})
					params.start_time = this.startDate;
					params.end_time = this.endDate;
					api.get({
					url: 'searchstockbydate',
					data: {									
						start_time : params.start_time,
						end_time   : params.end_time,
						openid:uni.getStorageSync("openid"),
						companyid: uni.getStorageSync("companyid"),
					},
					success: data => {
						console.log(data);
						if (data!="") {
							this.list = data;
							uni.hideLoading();
						}else{
							uni.showToast({
								title: '库存不存在',
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
</style>
