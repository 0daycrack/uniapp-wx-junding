<template>
	<view class="qiun-columns">
		<view class="cu-bar bg-white" >
			<view class="qiun-title-dot-light">员工详细数据统计</view>
		</view>
		<view class="qiun-charts" >
			<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA" disable-scroll=true>></canvas>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var api = require('@/common/api.js')
	var _self;
	var canvaColumn=null;

	export default {
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				serverData:'',
				charttype:'',
			}
		},
		onLoad(e) {
			console.log(e)
			this.charttype=e.charttype
			this.reportdate=e.reportdate
			this.reporttype=e.reporttype
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			getServerData(){
				api.get({
					url: 'getreport',
					data:{
						openid:uni.getStorageSync("openid"),
						reportdate:this.reportdate,
						companyid:uni.getStorageSync("companyid"),
						reporttype:this.reporttype,						
					},
					success: function(res) {
						console.log(res)
						//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
						_self.serverData=res;
						let Column={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories=res['usernamelist'];
						if(_self.charttype=="客户"){
							Column.series=res['usercuscountlist'];
						}
						if(_self.charttype=="订单"){
							Column.series=res['userordercountlist'];
						}
						if(_self.charttype=="任务"){
							Column.series=res['usertaskcountlist'];
						}
						if(_self.charttype=="通话"){
							Column.series=res['usertcallcountlist'];
						}						
						_self.usercuscountlist=res['usercuscountlist']
						_self.usertaskcountlist=res['usertaskcountlist']
						_self.usertcallcountlist=res['usertcallcountlist']
						_self.userordercountlist=res['userordercountlist']
						_self.showColumn("canvasColumn",Column);
						
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
			},
			showColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					padding:[15,5,0,15],
					legend:{show:true,
						padding:5,
						lineHeight:11,
						margin:0,},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					enableScroll: true,//开启图表拖拽功能
					xAxis: {
						type:'grid',
						gridType:'dash',
						itemCount:5,//x轴单屏显示数据的数量，默认为5个
						scrollShow:true,//新增是否显示滚动条，默认false
						scrollAlign:'left',//滚动条初始位置
						scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
						scrollColor:'#DEE7F7',//默认为 #A6A6A6
					},
					yAxis: {
						//disabled:true
					},
					dataLabel: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
							type:'group',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
						}
					  }
				});
				
			},
			touchLineA(e){
				canvaColumn.scrollStart(e);
			},
			moveLineA(e) {
				canvaColumn.scroll(e);
			},
			touchEndLineA(e) {
				canvaColumn.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			touchColumn(e){
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						if(typeof item.data === 'object'){
							return category + ' ' + item.name + ':' + item.data.value 
						}else{
							return category + ' ' + item.name + ':' + item.data 
						}
					}
				});
			},
		}
	}
</script>

<style>
page{background:#F2F2F2;width: 750upx;overflow-x: hidden;}
.qiun-padding{padding:2%; width:96%;}
.qiun-wrap{display:flex; flex-wrap:wrap;}
.qiun-rows{display:flex; flex-direction:row !important;}
.qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{background:#FFFFFF;}
.qiun-title-bar{width:96%; padding:10upx 2%; flex-wrap:nowrap;}
.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000}
.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
</style>