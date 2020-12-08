<template>
	<view>
<!-- 		<view class="cu-timeline">
			<view class="cu-time">昨天</view>
			<view class="cu-item cur cuIcon-noticefill">
				<view class="content bg-green shadow-blur">
					<text>22:22</text> 【广州市】快件已到达地球
				</view>
			</view>
		</view> -->
		<view v-for="(item,i) in list" :key="i" class="cu-item">		
			<view class="cu-timeline">
				<!-- <view class="cu-time">{{item.createtime}}</view> -->
				<view class="cu-item">
					<view class="content shadow-blur">
						<view class="cu-capsule radius ">
							<view class="cu-tag bg-red">{{item.name}}</view>
							<view class="cu-tag line-red">{{item.createtime}}</view>
						</view>
						<view class="cuIcon-info text-black">{{item.modfield}}</view>
						<view class="flex-wrap">
						<view class=" cu-tag line-red radius">{{item.beforedata ? item.beforedata : "空"}}</view>  >>
						<view class=" cu-tag line-cyan radius" >{{item.afterdata ? item.afterdata : "空"}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var api = require('@/common/api.js');	
	export default {
		data() {
			return {
				modtypeid:"",
				modtype:"",
				list:""
			};
		},
		onLoad(e){
			this.modtypeid=e.id
			this.modtype=e.type
			console.log(e.type)
			console.log(e.id)
			this.getHistory();
		},
		
		methods: {
			getHistory:function(){
				api.get({
					url: 'searchhistory',
					data: {
						modtype: this.modtype,
						modtypeid: this.modtypeid,
						// device_type: api.DeviceType	
					},
					success: (res) => {
						if (res!="") {
							this.list=res											
						}else{
						uni.showToast({
							title: '无修改历史',
							icon: "none",
							duration: 1000
						});
						this.list = '';
					}
					}
				});	
			}
		}
	}
</script>

<style>

</style>
