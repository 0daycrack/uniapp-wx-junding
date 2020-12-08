<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>库存详细资料<text class="text-gray text-sm padding-left-sm">更新时间：{{List.modifytime}}</text>
					</view>
				</view>
			</view>
			<view class="card-menu cu-list menu" >
				<view class="cu-item" >
					<view class="content">
						库存名称：
					</view>
					<input class="edit-input" v-model="stockname" name="stockname"v-if="allowedit"></input>
					<view class="action" v-else>
						{{List.stockname}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">库存数量：</view>
					<input class="edit-input" v-model="stocknumber" name="stocknumber"  v-if="allowedit"></input>				
					<view class="action" v-else>{{List.stocknumber}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">库存备注：</view>
					<input class="edit-input" v-model="stockremark" name="stockremark"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.stockremark}}</view>	
				</view>
				<view class="cu-item" >
					<view class="content">更新时间：</view>
					<view class="action">{{List.modifytime}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">创建时间：</view>
					<view class="action">{{List.createtime}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">创建人：</view>
					<view class="action">{{List.name}}</view>
				</view>
				<view class="cu-item">
					<button class="cu-btn bg-blue shadow" @tap="toHistory(List.stockid,'stock')">查看历史</button>
					<button class="cu-btn bg-blue shadow" @tap="endEdit(List.stockid)" v-if="allowedit">提交修改</button>
					<button class="cu-btn bg-blue shadow" @tap="startEdit()" v-else>修改库存</button>	
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
				allowedit:false,
				List:{},
				stocknumber:"",
				stockname:"",
				stockremark:"",
			}
		},		
		onLoad(e) {			
			console.log(e)
			uni.showLoading({
				title:"数据加载中"
			})
			this.stockid = e.stockid
			api.get({
				url: 'sstkdetail',
				data: {
					stockid: this.stockid,
					// device_type: api.DeviceType	
				},
				success: (res) => {
					if (res!="") {
						var _this=this
						this.loading = false;
						_this.List = res
						this.stocknumber=_this.List.stocknumber
						this.stockname=_this.List.stockname
						this.stockremark=_this.List.stockremark
						uni.hideLoading();
						console.log(_this.List)														
					}else{
					uni.showToast({
						title: '库存不存在',
						icon: "none",
						duration: 1000
					});
					this.List = '';
				}
				}
			});			
		},
		methods: {
			toHistory:function(id,type){
				uni.navigateTo({
					url:"../history/history"+"?id="+id+"&type="+type
				})
			},
			startEdit:function(){
				this.allowedit=true		
			},
			endEdit:function(stockid){
				var _this=this;
				uni.showModal({
				    title: '提示',
				    content: '是否确认要更新库存?',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户确定更新');
							_this.updateStock(stockid);				
				        } else if (res.cancel) {
				            console.log('用户取消更新');
				        }
				    }
				});
				
			},
			addHistory:function(){
				var at=this;
				var bf=this.List
				if(bf.stockname!=at.stockname){
					console.log("stockname 发生改变")
					this.addhistoryapi('stock',at.stockid,'库存名称',bf.stockname,at.stockname)
				}
				if(bf.stocknumber!=at.stocknumber){
					console.log("stocknumber 发生改变")
					this.addhistoryapi('stock',at.stockid,'库存数量',bf.stocknumber,at.stocknumber)
				}
				if(bf.stockremark!=at.stockremark){
					console.log("stockremark 发生改变")
					this.addhistoryapi('stock',at.stockid,'库存备注',bf.stockremark,at.stockremark)
				}
			},
			addhistoryapi:function(type,id,filed,befval,aftval){
				api.get({
					url: 'modifyform',
					data: {
						openid :uni.getStorageSync("openid"),
						modtype: type,
						modtypeid: id,						
						modfield:filed,
						beforedata:befval,
						afterdata:aftval,
					},
					success: (res) => {
						if (res.code=="success") {
						}else{
						uni.showToast({
							title: '更新修改历史',
							icon: "none",
							duration: 1000
						});
					}
					}
				});	
			},
			updateStock:function(stockid){
				api.get({
					url: 'updatestockinfo',
					data: {
						stockid: stockid,
						stocknumber: this.stocknumber,
						stockname:this.stockname,
						stockremark:this.stockremark,
						// device_type: api.DeviceType	
					},
					success: (res) => {
						if (res.code=="success") {
							this.addHistory();
							uni.showToast({
								title: '订单修改成功',
								icon: "none",
								duration: 1000
							});
							uni.navigateBack({
								animationDuration:1000
							})
						}else{
						uni.showToast({
							title: '订单修改失败',
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
