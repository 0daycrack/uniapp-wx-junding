<template>
	<view>
		<uni-calendar ref="calendar"  :insert="false" :lunar="true" :startDate="'2020-01-01'"
		 :endDate="'2025-12-31'" :range="true" @confirm="onSelected" />
		<!-- <mx-datepicker :show="showPicker" type="range" @confirm="onSelected" :show-seconds="true" @cancel="onCancel" /> -->
		    <view class="content">
		        <sl-filter :themeColor="themeColor" :menuList="menuList" @result="result"></sl-filter>
		    </view>
		<view class="cu-bar search bg-white shadow" id="search">
			<view class="padding-left-sm">
				<picker :range="searchType" @change="change">
					<view style="display: flex;align-items: center;">{{searchType[index]}}
						<text class="cuIcon-triangledownfill" style="font-size: 16px;height: 16px;padding-left: 1upx;"></text>
					</view>
				</picker>
			</view>
			<view class="search-form round" v-if="index < 2">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" v-model="search_text" :adjust-position="false" :type="text" :placeholder='"总客户数:"+totoalcus':confirm-type="search">
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
				<navigator v-for="(item,i) in list" :key="i" class="cu-item" :url="'../detail/customerdetail?customerid=' + item.customerid">
					<view class="content padding-tb-sm">
						
						<view class="cu-capsule radius shadow-lg">
							<view class="cu-tag bg-red">成交状态</view>
							<view class="cu-tag line-cyan" v-if="item.customeractive=='0'">未成交</view>
							<view class="cu-tag line-red" v-if="item.customeractive=='1'">已成交</view>
							
						</view>
						<!-- <view class="bg-gradual-red radius" v-if="item.customeractive=='0'">类型：未成交</view>
						<view class="bg-gradual-green radius" v-if="item.customeractive=='1'">类型：已成交</view> -->
						<view class="cuIcon-peoplelist">客户姓名：{{item.customername}}</view>
						<view class="cuIcon-phone text-gray ">
							 客户电话：{{item.customerphone}}
						</view>
						<view class="cuIcon-rank text-gray ">
							 客户类型：{{item.customerfilter}}
						</view>
						<view class="cuIcon-global text-gray ">
							 客户来源：{{item.customerfrom}}
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
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	export default {
		data() {
			return {
				customerid:'',
				customername:'',
				userlevel:'',
				companyid:'',
				startDate:'开始日期',
				endDate:'结束日期',
				InputBottom:0,
				index:0,
				showPicker:false,
				searchType: ['客户名称', '添加日期'],				
				scrollHeight:'',
				list:[],
				search_text:'',
				totoalcus:0,
				reachbottom:'',
				themeColor: '#000000',
				                filterResult: '',
				                menuList: [{
				                        'title': '成交状态',
				                        'detailTitle': '请选择客户成交状态（单选）',
				                        'isMutiple': false,
				                        'key': 'customeractive',
				                        'detailList': [{
				                                'title': '不限',
				                                'value': ''
				                            },
				                            {
				                                'title': '未成交',
				                                'value': '0'
				                            },
				                            {
				                                'title': '已成交',
				                                'value': '1'
				                            },
											{
											    'title': 'A类客户',
											    'value': 'A'
											},
											{
											    'title': 'B类客户',
											    'value': 'B'
											},
											{
											    'title': 'C类客户',
											    'value': 'C'
											},
				                        ]
				
				                    },
				                    {
				                        'title': '客户来源',
				                        'key': 'customerfrom',
				                        'isMutiple': false,
				                        'detailTitle': '请选择客户来源（单选）',
				                        'detailList': [{
				                                'title': '不限',
				                                'value': ''
				                            },
				                            {
				                                'title': '客户转推',
				                                'value': '客户转推'
				                            },
				                            {
				                                'title': '异业介绍',
				                                'value': '异业介绍'
				                            },
				                            {
				                                'title': '自然客流',
				                                'value': '自然客流'
				                            },
				                            {
				                                'title': '主动营销',
				                                'value': '主动营销'
				                            },
											{
												'title': '线上推广',
												'value': '线上推广'
											},
				                        ]
				
				                    },
				                    {
				                        'title': '客户状态',
				                        'key': 'customerstate',
				                        'isMutiple': false,
				                        'detailTitle': '请选择（单选）',
				                        'detailList': [{
				                                'title': '不限',
				                                'value': ''
				                            },
				                            {
				                                'title': '启用',
				                                'value': '0'
				                            },
				                            {
				                                'title': '禁用',
				                                'value': '1'
				                            },
				                        ]
				                    },
				                    {
				                        'title': '排序',
				                        'key': 'sort',
				                        'isSort': true,
				                        'detailList': [{
				                                'title': '默认排序',
				                                'value': ''
				                            },
				                            {
				                                'title': '添加时间',
				                                'value': 'add_time'
				                            },
				                        ]
				                    }
				                ]

				
			}
		},
		components: {
			MxDatepicker,uniCalendar,slFilter
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
			this.searchCustomer();
		},
		onLoad(){
			
		},
		methods: {
			// slfilter
			result(val) {
			                console.log('filter_result:' + JSON.stringify(val));
			                this.filterResult = JSON.stringify(val, null, 2)
			            },		
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
			searchCustomer(){
				api.get({
					url: 'searchcustomer',
					data: {
						openid:uni.getStorageSync("openid"),
						customername:this.customername,
						filterresult:this.filterResult,
						userlevel:uni.getStorageSync("userlevel"),
						companyid:uni.getStorageSync("companyid")
					},
					success: (res) => {
						// console.log(res.data);
						if (res!="") {
							this.list = res
							this.totoalcus=this.list.length
							console.log(res)
						}else{
						uni.showToast({
							title: '无客户,请新增',
							icon: "none",
							duration: 1000
						});
						this.list = '';
						this.customername = '';
						this.totoalcus=0;
					}
					}
				});	
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
					//选择客户来源
					//选择客户名称
					if(index == 0){
						this.customername=this.search_text;
						this.searchCustomer();
					};
					params.text = this.search_text;
					console.log(index);
				}else if(index == 1){  
					params.start_time = this.startDate;
					params.end_time = this.endDate;
					api.get({
					url: 'searchcustomerbydate',
					data: {									
						openid:uni.getStorageSync("openid"),
						companyid: uni.getStorageSync("companyid"),
						start_time : params.start_time,
						end_time   : params.end_time,
					},
					success: data => {
						console.log(data);
						if (data!="") {
							this.list = data;											
						}else{
							uni.showToast({
								title: '客户不存在',
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
		onPullDownRefresh() {
			this.searchCustomer();
			// page = 1
			// reachbottom = true
			// this.listData = []
			// this.getList()

		},
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
