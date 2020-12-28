<template>
	<view>
		<view class="cu-bar search bg-white shadow">
			<view class="qiun-title-dot-light">数据统计</view>
		</view>
		<view class="card-menu cu-list menu margin-top">
			<view class="cu-form-group">
				<view class="cuIcon-time title">统计周期：</view>
				<picker @change="PickerChange" :value="index" :range="picker" name='levellist'>
					<view class="picker">
						{{index>-1?picker[index]:'选择周期'}}
					</view>
				</picker>
			</view>
		</view>
		<view class="card-menu cu-list menu">
			<view class="cu-form-group" v-if="index==2">
				<picker @change="SeasonPickerChange" :value="seasonindex" :range="seasonpicker" name='levellist'>
					<view class="picker">
						{{seasonindex>-1?seasonpicker[seasonindex]:'选择季度'}}
					</view>
				</picker>
			</view>

			<view class="cu-form-group shadow" v-if="index!=2 ">
				<view class="cuIcon-calendar  basis-lg title">日期选择：</view>
				<!-- <view class="title"></view> -->
				<view class="title"></view>
				<view class="title"></view>
				<input placeholder="点击选择日期" v-model="reportdate" name="reportdate" @click="onShowDatePicker(type)" disabled="disabled"></input>
			</view>

			<mx-date-picker :format="dateformate" :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'"
			 :end-text="'结束'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
			<view class="qiun-charts" v-if="showchart">
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchIt($event,'canvasColumn')"></canvas>
			</view>
			<view class="qiun-charts" v-if="showchart">
				<canvas canvas-id="canvasColumnMoney" id="canvasColumnMoney" class="charts"></canvas>
			</view>
			<view class="qiun-charts" v-if="showchartperson">
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			</view>
			<!-- 		<view class="qiun-charts" v-if="showchartperson">
			<canvas canvas-id="canvasPerson" id="canvasPerson" class="charts" disable-scroll=false></canvas>
		</view> -->
		</view>
	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvasObj = {};
	var canvaColumn = null;
	var canvasColumnMoney = null;
	var canvaPie = null;
	var api = require('@/common/api.js')

	export default {
		components: {
			MxDatePicker,
		},
		data() {
			return {
				showPicker: false,
				type: 'date',
				dateformate: 'yyyy-mm-dd',
				// datetime: '2019/01/01 15:00:12',
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				reportdate: this.getTime(),
				seasonindex: -1,
				seasonpicker: ['1', '2', '3', '4'],
				picker: ['每日', '每月', ' 每季度', '每年', '自定义时间段'],
				index: 0,
				startdate: '',
				showchart: true,
				showchartperson: true,
				enddate: '',
				value: '',
				reporttype: 'day',
				usercuscountlist: [],
				usertaskcountlist: [],
				usertcallcountlist: [],
				userordercountlist: [],
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
			this.date = this.getTime();
		},
		methods: {
			onShowDatePicker(type) { //显示
				this.type = type;
				this.showchart = false;
				this.showchartperson = false;
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected(e) { //选择
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
					// 报表日期变为选择器的值
					this.reportdate = e.value
					console.log('value => ' + e.value);
					this.showchart = true;
					this.showchartperson = true;
					this.getServerData();
					this.datetime = e.value
					//原始的Date对象
					console.log('date => ' + e.date);
				}
			},
			SeasonPickerChange(e) {
				this.seasonindex = e.detail.value
				console.log(this.seasonpicker[this.seasonindex])
				// 选择季度时,赋值给 reportdate
				this.reportdate = this.seasonpicker[this.seasonindex]
				this.getServerData();
			},
			PickerChange(e) {
				this.index = e.detail.value
				if (this.index == 4) {
					//时间选择器变为日期范围
					this.type = "rangetime"
				} else {
					//清空数据
					this.type = "date"
					this.value = ""
					this.reportdate = ""
				}
				console.log(this.picker[this.index])
			},
			getTime: function() {
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
			getServerData() {
				api.get({
					url: 'getreport',
					data: {
						openid: uni.getStorageSync("openid"),
						reportdate: this.reportdate,
						companyid: uni.getStorageSync("companyid"),
						reporttype: this.index,

					},
					success: function(res) {
						console.log(res)
						//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
						_self.serverData = res;
						let Column = {
							categories: [],
							series: []
						};
						let ColumnMoney = {
							categories: [],
							series: []
						};
						let Pie = {
							series: []
						};
						console.log(res)
						// let Person={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories = ["新增客户", "新增订单", "每日任务", "通话次数"];
						Column.series = res['totalseries'];
						ColumnMoney.categories = res['usernamelist'];
						ColumnMoney.series = res['usermoneylist'];
						// // Person.categories = res['usernamelist']
						Pie.series = res['fromseries']
						// Person.series = res['countseries']
						_self.usercuscountlist = res['usercuscountlist']
						_self.usertaskcountlist = res['usertaskcountlist']
						_self.usertcallcountlist = res['usertcallcountlist']
						_self.userordercountlist = res['userordercountlist']
						_self.showPie("canvasPie", Pie)
						_self.showColumn("canvasColumn", Column);
						_self.showColumn("canvasColumnMoney",ColumnMoney)

					},
					fail: () => {
						_self.tips = "网络错误，小程序端请检查合法域名";
					},
				});
			},
			showColumn(canvasId, chartData) {
				canvasObj[canvasId] = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					padding: [15, 40, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					colors: ['#40297f'],
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					enableScroll: true, //开启图表拖拽功能
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						itemCount: 4, //x轴单屏显示数据的数量，默认为5个
						scrollShow: true, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7', //默认为 #A6A6A6
					},
					yAxis: {
						format:val=>{return val.toFixed(2)}
						//disabled:true
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});

			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					legend: {
						show: true
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					},
				});
			},
			updatePersonData: function(obj, type) {
				if (type == "新增客户") {
					uni.navigateTo({
						url: "./unchatson?charttype=" + "客户" + "&reportdate=" + this.reportdate + "&reporttype=" + this.index
					})
					console.log(_self.usercuscountlist)
				}
				if (type == "新增订单") {
					uni.navigateTo({
						url: "./unchatson?charttype=" + "订单" + "&reportdate=" + this.reportdate + "&reporttype=" + this.index
					})
					console.log(_self.userordercountlist)
				}
				if (type == "每日任务") {
					uni.navigateTo({
						url: "./unchatson?charttype=" + "任务" + "&reportdate=" + this.reportdate + "&reporttype=" + this.index
					})
					console.log(_self.usertaskcountlist)
				}
				if (type == "通话次数") {
					uni.navigateTo({
						url: "./unchatson?charttype=" + "通话" + "&reportdate=" + this.reportdate + "&reporttype=" + this.index
					})
					console.log(_self.usertcallcountlist)
				}
			},
			touchIt(e, id) {
				canvasObj[id].touchLegend(e, {
					animation: false
				});
				canvasObj[id].showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							console.log(item.name)
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							console.log(category)
							_self.updatePersonData(canvasObj["canvasPerson"], category);
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
			onPullDownRefresh() {
				console.log("下拉刷新数据")
				uni.showToast({
					title: '成功刷新数据',
					duration: 1500,
					icon: "none"
				});
				uni.stopPullDownRefresh();
			},
		}
	}
</script>

<style>
	page {
		background: #F2F2F2;
		width: 750upx;
		overflow-x: hidden;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #FFFFFF;
	}

	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}

	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>
