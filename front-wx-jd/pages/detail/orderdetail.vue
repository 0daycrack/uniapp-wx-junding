<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-red cuIcon-roundrightfill"></text>订单详细资料<text class="text-gray text-sm padding-left-sm">更新时间：{{List.modifytime}}</text>
					</view>
				</view>
			</view>
			<view class="card-menu cu-list menu">
				<view class="bg-white padding-tb-sm">
					<view class="cu-steps">
						<view class="cu-item" :class="index>basics?'':'text-red'" v-for="(item,index) in basicsList" :key="index">
							<text :class="index>basics?'cuIcon-title':'cuIcon-' + item.cuIcon"></text> {{item.name}}
						</view>
					</view>
				</view>			
			</view>
			<view class="card-menu cu-list menu" >
				<view class="cu-item" v-if="allowedit">
					<view class="content">订单状态:</view>
					<picker @change="PickerChange" :value="inout" :range="picker" name='orderstate'>
						<view class="picker edit-input" >
							{{inout>-1?picker[inout]:List.orderstate}}
						</view>
					</picker>
				</view>
				<view class="cu-item" v-else>
					<view class="content">
						订单状态：
					</view>
					<view class="action">
						{{List.orderstate}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户姓名：</view>
					<view class="action">{{List.customername}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户电话：</view>
					<view class="cu-tag round bg-gradual-red light" @click="call(List.customerphone)">
						{{List.customerphone}}
					</view>
					<!-- <view class="action">{{List.customerphone}}</view> -->
				</view>
				<view class="cu-item" >
					<view class="content">订单数量：</view>
					<view class="action">{{List.ordernumber}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">订单金额：</view>
					<input class="edit-input" v-model="ordermoney" name="ordermoney"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.ordermoney}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">定金金额：</view>
					<input class="edit-input" v-model="orderdeposit" name="orderdeposit"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.orderdeposit}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">商品名称：</view>
					<view class="action">{{List.stockname}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">下定日期：</view>
					<view class="action">{{List.orderdate}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">录单人：</view>
					<view class="action">{{List.name}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">录单人电话：</view>
					<view class="action">{{List.mobile}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">创建时间：</view>
					<view class="action">{{List.createtime}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">送货人：</view>
					<input class="edit-input" v-model="ordersendname" name="ordersendname"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.ordersendname}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">送货人手机：</view>
					<input class="edit-input" v-model="ordersendphone" name="ordersendphone"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.ordersendphone}}</view>
				</view>
				<view class="cu-item " v-if="allowedit">
					<view class="content">选择送货时间</view>
					<picker mode="date" :value="date" start="2000-01-01" end="2999-12-31" @change="DateChange">
						<view class="picker edit-input">
							{{ordersenddate}}
						</view>
					</picker>
				</view>
				<view class="cu-item" v-else>
					<view class="content">送货时间：</view>
					<!-- <input class="edit-input" v-model="ordersenddate" name="ordersenddate"  v-if="allowedit"></input> -->
					<view class="action">{{List.ordersenddate}}</view>
				</view>
				<view class="cu-item"  v-if="allowedit">
					<view class="content">上传图片：</view>
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						 <image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
				<view class="cu-item" v-else>
					<view class="content">收货图片：</view>
					<view class="grid col-4 grid-square flex-sub">
						<view></view><view></view>
						<view class="bg-img"  @tap="ViewImage" :data-url="orderimgurl">
						 <image :src="orderimgurl" mode="aspectFill"></image>
						 </view>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户反馈：</view>
					<input class="edit-input" v-model="orderfeedback" name="orderfeedback"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.orderfeedback}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">备注：</view>
					<input class="edit-input" v-model="orderremark" name="orderremark"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.orderremark}}</view>
				</view>
				<view class="cu-item" v-if="allowedit">
					<button class="cuIcon-check cu-btn bg-gradual-red shadow animation-fade" @tap="confirmOrder(List.orderid)":loading="loading">订单确认</button>
					<button class="cuIcon-close cu-btn bg-gradual-red shadow animation-fade" @tap="allowedit=false">取消修改</button>				
				</view>
				<view class="cu-item" v-else>
					<button class="cuIcon-edit cu-btn round bg-gradual-red shadow "@tap="allowedit=true":loading="loading">订单修改</button>
					<button class="cuIcon-comment cu-btn round bg-gradual-red shadow" @tap="toHistory(List.orderid,'order')">查看历史</button>
					<button class="cuIcon-delete cu-btn round bg-gradual-red shadow " @tap="deleteOrder()">删除订单</button>
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
				imgList: [],
				List:{},
				orderid:"",
				customerid:"",
				stockid:"",
				ordermoney:"",
				orderdeposit:"",
				ordersendname:"",
				ordersendphone:"",
				orderfeedback:"",
				orderremark:"",
				orderstate:"",
				orderimgurl:"",
				allowedit:false,
				inout:-1,
				ordersenddate:'2020-01-01',
				picker: ['未发货','已发货'],
				basicsList: [{cuIcon: 'formfill',name: '订单录入'}, 
				             {cuIcon: 'cartfill',name: '订单发货'}, 
				             {cuIcon: 'likefill',name: '客户反馈'},
				             {cuIcon: 'roundcheckfill',name: '完成'}],
				basics: 0
				
				
			}
		},		
		onLoad(e) {	
			console.log(e)
			uni.showLoading({
				title:"数据加载中"
			})
			this.orderid = e.orderid			
			api.get({
				url: 'sodetail',
				data: {
					orderid: this.orderid,
					// customerid:this.customerid
					// device_type: api.DeviceType	
				},
				success: (res) => {
					console.log(res);
					if (res!="") {
						this.loading = false;
						// 赋值
						this.List = res[0]
						this.orderstate = this.List.orderstate
						this.stockid = this.List.stockid
						this.ordermoney = this.List.ordermoney
						this.orderdeposit = this.List.orderdeposit
						this.ordersendname = this.List.ordersendname
						this.ordersendphone = this.List.ordersendphone
						this.ordersenddate = this.List.ordersenddate
						this.orderfeedback = this.List.orderfeedback
						this.orderremark = this.List.orderremark
						this.orderimgurl = api.HOST+"/media/"+this.List.orderimg
						uni.hideLoading();
						this.JudgeState();
						console.log(res)														
					}else{
					uni.showToast({
						title: '订单不存在',
						icon: "none",
						duration: 1000
					});
					this.List = '';
				}
				}
			});			
		},
		methods: {
			JudgeState(){
				if(this.List.ordersendname!=""){
					this.BasicsSteps()
					this.updateComplete(0)
					if(this.List.orderfeedback!=""){
						this.BasicsSteps()
						this.BasicsSteps()
						this.updateComplete(1)
					}
				}
			},
			BasicsSteps() {
							this.basics= this.basics == this.basicsList.length - 1 ? 0 : this.basics + 1				
						},
			updateComplete(state){
				api.get({
					url: 'updatecomplete',
					data: {
						orderid: this.orderid,
						ordercomplete:state
					},
					success: (res) => {				
						if (res.code=="success") {
							console.log("更新订单完成状态");
						}else{
						uni.showToast({
							title: '更新订单完成状态失败',
							icon: "none",
							duration: 1000
						});
					}
					}
				});
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
							console.log(this.imgList)
						} else {
							this.imgList = res.tempFilePaths
							console.log(this.imgList)
							this.upLoadimg();
						}
					}
				});
			},
			upLoadimg(){
				console.log("准备上传")
				console.log(api.HOST)
				uni.uploadFile({
				    url:api.HOST+"/uploadfile",     // 后端api接口  
					// url:"https://0.0.0.0:8000/uploadfile",
				    filePath: this.imgList[0], // uni.chooseImage函数调用后获取的本地文件路劲
				    name:'file',     //后端通过'file'获取上传的文件对象
					method:"POST",
				    formData: {orderid:this.orderid},
				    header:{"Content-Type": "multipart/form-data"},
				    success:(res) => {
				        if (res.data.code == 200){
				            console.log('文件上传成功')
				        }
				    },
					complete:(res)=>{
						console.log(res)
					}
				});
			},
			ViewImage(e) {
				console.log(e.currentTarget.dataset.url)
				uni.previewImage({
					urls: [this.orderimgurl],
					current: e.currentTarget.dataset.url,
					complete:(res)=>{
						console.log(res)
					}
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '删除提示',
					content: '确定要删除图片吗？',
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			toHistory:function(id,type){
				uni.navigateTo({
					url:"../history/history"+"?id="+id+"&type="+type
				})
			},
			addHistory:function(){
				let modlist={'orderstate':'订单状态','ordermoney':'订单金额','orderdeposit':'订单定金',
				'ordersendname':'送货人','ordersendphone':'送货人电话','ordersenddate':'送货日期',
				'orderfeedback':'客户反馈'			
				};
				for(let field in modlist){
					var at=this;
					var bf=this.List	
					if(bf[field]!=at[field]){
						console.log(field,modlist[field],"改变")
						this.addhistoryapi('order',at.orderid,modlist[field],bf[field],at[field])
					}
				    
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
			confirmOrder(orderid){
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
							console.log(this.orderstate)
							api.get({
								url: 'updateorderinfo',
								data: {
									orderid: orderid,
									orderstate : this.orderstate,
									stockid : this.stockid,
									ordermoney : this.ordermoney,
									orderdeposit : this.orderdeposit,
									ordersendname : this.ordersendname,
									ordersendphone : this.ordersendphone,
									ordersenddate : this.ordersenddate,
									orderfeedback : this.orderfeedback,
									orderremark : this.orderremark,
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
										this.addHistory();
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
			PickerChange(e) {
				this.inout = e.detail.value
				this.orderstate=this.picker[this.inout]
			},
			DateChange(e) {
				this.ordersenddate = e.detail.value
			},	
			deleteOrder(){
				var _this=this
				uni.showModal({
				    title: '提示',
				    content: '是否要删除订单,订单关联的收支记录也将删除',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户确定删除');
							_this.deleteOrderBudget();
							_this.recoverStock();
				
				        } else if (res.cancel) {
				            console.log('用户取消删除');
				        }
				    }
				});
			},
			recoverStock(){
				api.get({
					url: 'recoverstock',
					data: {
						stockid: this.stockid,
						ordermoney:this.ordermoney
					},
					success: (res) => {
						console.log(res);
						if (res.code=="success") {
							uni.showToast({
								title: '库存还原成功',
								icon: "none",
								duration: 1000
							});
						}else{
						uni.showToast({
							title: '库存还原失败',
							icon: "none",
							duration: 1000
						});
					}
					}
				});
			},
			deleteOrderBudget(){
				api.get({
					url: 'deleteorderbudget',
					data: {
						orderid: this.orderid,
					},
					success: (res) => {
						console.log(res);
						if (res.code=="success") {
							uni.showToast({
								title: '订单删除成功',
								icon: "none",
								duration: 1000
							});	
							uni.reLaunch({
								url:"../list/orderlist"
							})
							setTimeout((e => {
								uni.navigateBack();
							}), 2500);
						}else{
						uni.showToast({
							title: '订单删除失败',
							icon: "none",
							duration: 1000
						});
					}
					}
				});	
			},
				modifyOrderState(){
					this.allowedit=true
					console.log(this.orderstate)
					if(this.orderstate=="未发货"){
						this.newstate="已发货";
					}else{
						this.newstate="未发货";
					}
					api.get({
						url: 'modorderstate',
						data: {
							orderid: this.orderid,
							orderstate: this.newstate
						},
						success: (res) => {
							// console.log(res.data);
							if(res.code=="success"){
								uni.showToast({
									title: '修改成功',
									icon: "none",
									duration: 1000
								});
							}else{
								uni.showToast({
									title: '修改失败',
									icon: "none",
									duration: 1000
								});
							}

						}					
					});
				},
				call(mobile){
					uni.makePhoneCall({			
						// 手机号
						phoneNumber: mobile, 
					// 成功回调
					success: (res) => {
						this.updateCallTime(),
						console.log('通话Api调用成功!')
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
					
				  });
				},
				updateCallTime(){
					api.get({
						url: 'updatecalltime',
						data: {
							customerid: this.customerid					
						},
						success: (res) => {
							if (res!="") {
								this.list = res
								console.log(res)														
							}else{
							// this.customerid = '';
						}
						}
					});
					//记录到通话详情中
					this.customername=this.List.customername
					this.customerphone=this.List.customerphone		
					api.get({
						url: 'calldetailform',
						data: {
							openid: uni.getStorageSync("openid"),
							customerid: this.customerid,
							customername:this.customername,
							customerphone:this.customerphone,
							companyid: uni.getStorageSync("companyid"),							
						},
						success: (res) => {
							if (res!="") {
								this.list = res
								console.log(res)														
							}else{
							this.customerid = '';
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
