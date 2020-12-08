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
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" v-model="search_text" :adjust-position="false" type="text" placeholder="请输入搜索内容" confirm-type="search">
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @tap="searchSubmit">搜索</button>
			</view>
		</view>
		<scroll-view id="scroll" scroll-y = "true" :style="{height:scrollHeight}">
			<view class="cu-list menu card-menu margin-top-sm">
				<navigator v-for="(item,i) in list" :key="i" class="cu-item">
					<view class="content padding-tb-sm">
						<view>员工名称：{{item.name}}</view>
						<view class="text-gray ">
							 员工等级：{{item.level}}
						</view>
						<view class="text-gray ">
							  员工手机号：{{item.mobile}}
						</view>
						<view class="text-gray ">
							 公司ID：{{item.companyid}}
						</view>
						<view class="text-gray ">
							  创建时间：{{item.createtime}}
						</view>
					</view>
<!-- 					<view class="action">
						<view class="cu-tag round bg-orange">详情</view>
					</view> -->
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
				searchType: ['员工名称', '员工手机', '员工等级'],				
				scrollHeight:'',
				list:[],
				search_text:'',
				searchname:'',
				searchmobile:'',
				searchlevel:'',
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
		onLoad(){
					uni.showLoading({
						title:"加载数据中"
					})
					api.get({
						url: 'searchmyuserinfo',
						data: {
							companyid:uni.getStorageSync('companyid'),
							openid:uni.getStorageSync('openid'),
							level:uni.getStorageSync('userlevel'),
							searchname: "",
							searchmobile:"",
							searchlevel:"",
						},
						success: (res) => {
							// console.log(res.data);
							if (res!="") {
								this.list = res
								console.log(res)
								uni.hideLoading();
							}else{
							uni.showToast({
								title: '无人员信息',
								icon: "none",
								duration: 1000
							});
							this.list = '';
						}
						}
					});			
		},
		methods: {
			change: function(e) {
				this.index = e.detail.value;
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
				this.searchname=''
				this.searchmobile=''
				this.searchlevel=''
				if(index < 3 ){  //坑爹啊，判断应该用 == 而不是 ===，否则picker变，搜索框内容不变
					//选择员工名称
					if(index == 0){
						this.searchname=this.search_text;
					};
					//选择手机号
					if(index == 1){
						this.searchmobile=this.search_text;
					};
					if(index == 2){
						this.searchlevel=this.search_text;
					};
					params.text = this.search_text;
					api.get({
						url: 'searchmyuserinfo',
						data: {
							searchname: this.searchname,
							searchmobile: this.searchmobile,
							searchlevel:this.searchlevel,
							openid:uni.getStorageSync('openid'),
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
				}								
			},
		},		
		//下拉刷新
		// onPullDownRefresh() {
		// 	page = 1
		// 	reachbottom = true
		// 	this.listData = []
		// 	this.getList()

		// },
		// // 加载更多
		// onReachBottom: function() {
		// 	if (reachbottom) {
		// 		this.getList();
		// 	}
		// }
	}
</script>

<style>	
</style>
