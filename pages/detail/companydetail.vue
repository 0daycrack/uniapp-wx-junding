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
					<input class="edit-input" v-model="companyname" name="companyname"  v-if="allowedit"></input>
					<view class="action" v-else>
						{{List.companyname}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">公司 ID：</view>
					<view class="action">{{List.companyid}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">一级数量：</view>
					<input class="edit-input" v-model="l1count" name="l1count"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.l1count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">二级数量：</view>
					<input class="edit-input" v-model="l2count" name="l2count"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.l2count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">三级数量：</view>
					<input class="edit-input" v-model="l3count" name="l3count"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.l3count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">四级数量：</view>
					<input class="edit-input" v-model="l4count" name="l4count"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.l4count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">五级数量：</view>
					<input class="edit-input" v-model="l5count" name="l5count"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.l5count}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">创建时间：</view>
					<view class="action">{{List. createtime}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">备注：</view>
					<input class="edit-input" v-model="companyremark" name="companyremark"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.companyremark}}</view>
				</view>
				<view class="cu-item" v-if="allowedit">
					<button class="cuIcon-check cu-btn bg-gradual-red shadow animation-fade" @tap="confirmCompany(List.companyid)":loading="loading">公司确认</button>
					<button class="cuIcon-close cu-btn bg-gradual-red shadow animation-fade" @tap="allowedit=false">取消修改</button>				
				</view>
				<view class="cu-item" v-else>
					<button class="cuIcon-edit cu-btn round bg-gradual-red shadow "@tap="allowedit=true":loading="loading">公司修改</button>
					<button class="cuIcon-comment cu-btn round bg-gradual-red shadow" @tap="updateComanyId(List.companyid)">进入公司</button>
					<button class="cuIcon-delete cu-btn round bg-gradual-red shadow " @tap="deleteCompany()">停用公司</button>
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
				allowedit:false,
				companyname:'',
				l1count:'',
				l2count:'',
				l3count:'',
				l4count:'',
				l5count:'',
				companyremark:'',
				
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
						this.companyname=_this.List.companyname
						this.l1count=_this.List.l1count
						this.l2count=_this.List.l2count
						this.l3count=_this.List.l3count
						this.l4count=_this.List.l4count
						this.l5count=_this.List.l5count
						this.companyremark=_this.List.companyremark
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
			confirmCompany(companyid){
				uni.showModal({
					title: '确认提示',
					content: '确定要更新数据吗？',
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title:"数据更改中"
							})
							api.get({
								url: 'updatecompanyinfo',
								data: {
									companyid: companyid,
									companyname : this.companyname,
									l1count : this.l1count,
									l2count : this.l2count,
									l3count : this.l3count,
									l4count : this.l4count,
									l5count : this.l5count,
									companyremark : this.companyremark,
								},
								success: (res) => {
									console.log(res);
									if (res.code="success") {
										this.loading = false;
										uni.hideLoading();
										uni.showToast({
											title: '更改成功',
											icon: "none",
											duration: 1000
										});
										uni.navigateBack({
											
										})
									}else{
									uni.showToast({
										title: '更改失败',
										icon: "none",
										duration: 1000
									});
									this.List = '';
								}
								}
							});	
						}
					}
				})
			},
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
	.edit-input {
		text-align: right;
		box-sizing:border-box;
		border:1px solid transparent;
		border-radius: 4px;
		background-clip:padding-box,border-box;
		background-origin:padding-box,border-box;
		background-image:linear-gradient(90deg,#fff,#fff),linear-gradient(90deg,#000,red);
	}
</style>
