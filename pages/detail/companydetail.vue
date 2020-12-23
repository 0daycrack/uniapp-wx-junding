<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>公司详细资料<text class="text-gray text-sm padding-left-sm">更新时间：{{List.modifytime}}</text>
					</view>
				</view>
			</view>
			<view class="card-menu cu-list menu" >
				<view class="cu-item" >
					<view class="content">
						公司名称：
					</view>
					<view class="action">
						{{List.companyname}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">公司 ID：</view>
					<view class="action">{{List.companyid}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">一级数量：</view>
					<view class="action">{{List.l1count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">二级数量：</view>
					<view class="action">{{List.l2count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">三级数量：</view>
					<view class="action">{{List.l3count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">四级数量：</view>
					<view class="action">{{List.l4count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">五级数量：</view>
					<view class="action">{{List.l5count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">创建时间：</view>
					<view class="action">{{List. createtime}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">备注：</view>
					<view class="action">{{List.companyremark}}</view>
				</view>
				<view class="cu-item">
					<button class="cu-btn bg-blue shadow" @tap="updateComanyId(List.companyid)">潜伏到公司内部</button>
				</view>				
			</view>
		</form>
	</view>
</template>
<script>
	
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				List:{},
			}
		},		
		onLoad(e) {	
			console.log(e)
			uni.showLoading({
				title:"数据加载中"
			})
			this.companyid = e.companyid
			api.get({
				url: 'scompanydetial',
				data: {
					companyid: this.companyid,
					// device_type: api.DeviceType	
				},
				success: (res) => {
					if (res!="") {
						var _this=this
						this.loading = false;
						_this.List = res
						uni.hideLoading();
						console.log(_this.List)														
					}else{
					uni.showToast({
						title: '公司不存在',
						icon: "none",
						duration: 1000
					});
					this.List = '';
				}
				}
			});			
		},
		methods: {
			updateComanyId:function(companyid){
				api.get({
					url: 'updateusercompany',
					data: {
						openid: uni.getStorageSync("openid"),
						companyid: companyid,
						// device_type: api.DeviceType	
					},
					success: (res) => {
						if (res=="success") {
							uni.showToast({
								title: '潜伏成功',
								icon: "none",
								duration: 1000
							});
							uni.reLaunch({
								url:"../wxauthorize/wxauthorize"
							})
							setTimeout((e => {
								uni.navigateBack();
							}), 500);
						}else{
						uni.showToast({
							title: '潜伏失败',
							icon: "none",
							duration: 1000
						});
					}
					}
				});	
			},
		}
	}
</script>

<style>
	.scan-result {
		min-height: 50upx;
		line-height: 50upx;
	}
</style>
