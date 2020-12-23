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
		<view class="card-menu cu-list menu margin-top-sm">
			<view class="cu-item">
				<view class="content" >
					<text class="text-green cuIcon-roundrightfill"></text>总收入:{{intotalmoney}}
					<text class="cu-red text-bold padding-left-sm">|</text>
					<text class="text-red cuIcon-roundrightfill padding-left-sm"></text>总支出：{{outtotalmoney}}
				</view>
			</view>
		</view>
		<scroll-view id="scroll" scroll-y = "true" :style="{height:scrollHeight}">
			<view class="cu-list menu card-menu margin-top-sm">				
				<navigator v-for="(item,i) in list" :key="i" class="cu-item" >
					<view class="content padding-tb-sm">
						<view class="bg-gradual-red radius" v-if="item.tradetype=='支出'">类型：{{item.tradetype}}</view>
						<view class="bg-gradual-green radius" v-if="item.tradetype=='收入'">类型：{{item.tradetype}}</view>
						<view class="text-bold ">
							 收支分类：{{item.trademode}}
						</view>
						<view class="text-gray ">
							 收支金额：{{item.trademoney}}
						</view>
						<view class="text-gray "v-if="item.trademode=='订单'">
							 定金金额：{{item.tradedeposit}}
						</view>
						<view class="text-gray ">
							 收支方式：{{item.trademethod}}
						</view>
						<view class="text-gray ">
							 日期：{{item.createtime}}
						</view>
					</view>
					<view class="action" v-if="item.trademode!='订单'">
						<view class="cu-tag round bg-gradual-red" @click="deleteBudget(item.tradeid)">删除记录</view>
					</view>
					<view class="select-tip" v-else>
						<view class="cuIcon-attention round bg-yellow" @click="showTips"> 提示</view>
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
				userlevel:'',
				companyid:'',
				startDate:'开始日期',
				endDate:'结束日期',
				InputBottom:0,
				index:0,
				showPicker:false,
				searchType: ['收支类型', '收支分类', '收支日期'],				
				scrollHeight:'',
				list:[],
				search_text:'',
				tradetype:'',
				trademode:'',
				intotalmoney:'',
				outtotalmoney:'',

				
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
					this.loadBudget()		
		},
		methods: {
			loadBudget:function(e){
				uni.showLoading({
					title: "数据加载中"
				}),
				api.get({
					url: 'searchbudget',
					data: {
						openid:uni.getStorageSync("openid"),
						trademode:'',
						tradetype:'',
						userlevel:uni.getStorageSync("userlevel"),
						companyid:uni.getStorageSync("companyid")
					},
					success: (res) => {
						uni.hideLoading();
						// console.log(res.data);
						if (res.data!="") {
							this.list = res.data
							this.intotalmoney=res.intotalmoney
							this.outtotalmoney=res.outtotalmoney
							console.log(res.outtotalmoney)														
						}else{
						uni.showToast({
							title: '无收支记录',
							icon: "none",
							duration: 1000
						});
						this.list = '';
					}
					}
				});	
			},
			showTips:function(e){
				uni.showToast({
					icon:'none',
					title:"订单类收入无法删除,请到订单页面进行删除",
					duration:2000,
				})
			},
			deleteBudget:function(id){
				var _this=this;
				uni.showModal({
				    title: '提示',
				    content: '是否要删除该记录?',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户确定删除');
							_this.deleteBudgetApi(id);
							uni.reLaunch({
								url:"../index/index"
							});setTimeout((e => {
												uni.navigateBack();
											}), 500);

				        } else if (res.cancel) {
				            console.log('用户取消删除');
				        }
				    }
				});
			},
			deleteBudgetApi:function(e){
				api.get({
					url: 'deletebudget',
					data: {
						openid:uni.getStorageSync("openid"),
						tradeid: e,
						userlevel:uni.getStorageSync("userlevel"),
						companyid:uni.getStorageSync("companyid")						
					},
					success: (res) => {
						if (res!="") {
							this.list = res
							console.log(res)														
						}else{
						uni.showToast({
							title: '删除成功',
							icon: "none",
							duration: 1000
						});
					}
						if (res['code'] == "failed") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: "删除失败"
							});
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
				this.list = ''
				this.intotalmoney=''
				this.outtotalmoney=''
				params.type = index;  //获取picker的索引值，用于下面判断是日期还是关键字				
				//params.shequ_id = uni.getStorageSync('shequ').shequ_id;
				if(index < 2 ){  //坑爹啊，判断应该用 == 而不是 ===，否则picker变，搜索框内容不变
					//收支类型
					if(index == 0){
						this.tradetype=this.search_text;
					};
					//收支分类
					if(index == 1){
						this.trademode=this.search_text;
					};
					params.text = this.search_text;
					console.log(index);
					api.get({
						url: 'searchbudget',
						data: {
							openid:uni.getStorageSync("openid"),
							trademode:this.trademode,
							tradetype:this.tradetype,
							userlevel:uni.getStorageSync("userlevel"),
							companyid:uni.getStorageSync("companyid")
							
						},
						success: (res) => {
							// console.log(res.data);
							if (res.data!="") {
								this.list = res.data
								this.intotalmoney=res.intotalmoney
								this.outtotalmoney=res.outtotalmoney
								console.log(res)														
							}else{
							uni.showToast({
								title: '收支不存在',
								icon: "none",
								duration: 1000
							});
							this.list = '';
							this.intotalmoney = '';
							this.outtotalmoney = '';
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
					params.start_time = this.startDate;
					params.end_time = this.endDate;
					console.log(this.startDate)
					console.log(this.endDate)
					
					api.get({
					url: 'searchbudgetbydate',
					data: {
						openid:uni.getStorageSync("openid"),
						start_time : params.start_time,
						end_time   : params.end_time,
						userlevel:uni.getStorageSync("userlevel"),
						companyid:uni.getStorageSync("companyid")
					},
					success: data => {
						console.log(data);
						if (data.data!="") {
							this.list = data.data;
							this.intotalmoney=data.intotalmoney
							this.outtotalmoney=data.outtotalmoney
						}else{
							uni.showToast({
								title: '收支不存在',
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
