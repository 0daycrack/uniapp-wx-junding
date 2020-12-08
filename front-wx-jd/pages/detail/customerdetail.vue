<template>
	<view class="padding-top">
		<zhilin-picker
				v-model="show"
				:title="title"
				:data="datalist"
				:multiple="false"
				:initSelected="initSelected"
				:showSearch="true"
				@change="onChange"
				@confirm="onConfirm"
				@confirmlabel="onConfirmLabel"
		/>
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>客户详细资料 <text class="text-gray text-sm padding-left-sm">更新时间：{{List.modifytime}}</text>
					</view>
				</view>
			</view>
			<view class="card-menu cu-list menu" >
				<view class="cu-item" v-if="allowedit">
					<view class="content">客户类型:</view>
					<picker @change="PickerChange" :value="filterindex" :range="picker" name='customerfilter'>
						<view class="picker edit-input" >
							{{filterindex>-1?picker[filterindex]:List.customerfilter}}
						</view>
					</picker>
				</view>
				<view class="cu-item" v-else>
					<view class="content">
						客户类型：
					</view>
					<view class="action">
						{{List.customerfilter}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content"> 客户姓名：</view>
					<input class="edit-input" v-model="customername" name="customername"  v-if="allowedit"></input>
					<view class="action" v-else>{{List.customername}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						客户电话号：
					</view>
					<input class="edit-input" v-model="customerphone" name="customerphone"  v-if="allowedit"></input>			
					<view class="cu-tag round bg-gradual-blue light" v-else @click="call">
						{{List.customerphone}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户地址：</view>
					<input class="edit-input" v-model="customeraddress" name="customeraddress"  v-if="allowedit"></input>					
					<view class="action" v-else>{{List.customeraddress}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户生日：</view>
					<input class="edit-input" v-model="customerbirthday" name="customerbirthday"  v-if="allowedit"></input>					
					<view class="action" v-else>
						{{List.customerbirthday}}
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户年龄：</view>
					<input class="edit-input" v-model="customerold" name="customerold"  v-if="allowedit"></input>
					
					<view class="action" v-else>{{List.customerold}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">形体特征：</view>
					<input class="edit-input" v-model="customerbody" name="customerbody"  v-if="allowedit"></input>
					
					<view class="action" v-else>{{List.customerbody}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户状态：</view>
					<view class="action">
						<view class="cu-tag round bg-gradual-red light" @tap="modifyCustomer()">{{List.customerstate=='0' ? "启用": "禁用"}}</view>
						</view>
				</view>
				<view class="cu-item" >
					<view class="content">兴趣爱好：</view>
					<input class="edit-input" v-model="customerinterest" name="customerinterest"  v-if="allowedit"></input>
					
					<view class="action" v-else>{{List.customerinterest}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">客户来源：</view>
					<view class="action">{{List.customerfrom}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">成交状态：</view>
					<view class="action">{{List.customeractive=='0' ? "未成交": "已成交"}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">通话次数：</view>
					<view class="action">
						<view class="cu-tag round bg-orange light">{{List.customercalltime}}</view>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">创建时间：</view>
					<view class="action">{{List.createtime}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">所属人：</view>
					<view class="action">{{List.name}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">所属人联系方式：</view>
					<view class="action">{{List.mobile}}</view>
				</view>
				<view class="cu-item" >
					<view class="content">备注：</view>
					<view class="action">{{List.customerremark}}</view>
				</view>
				<view class="cu-item" v-if="allowedit">
					<button class="cuIcon-check cu-btn bg-gradual-red shadow animation-fade" @tap="confirmCustomer(List.customerid)":loading="loading">确认修改</button>
					<button class="cuIcon-close cu-btn bg-gradual-red shadow animation-fade" @tap="allowedit=false">取消修改</button>				
				</view>
				<view class="cu-item" v-else>
					<button class="cuIcon-edit cu-btn round bg-gradual-red shadow" @tap="allowedit=true">客户修改</button>
					<!-- <button class="cu-btn bg-blue shadow" @tap="modifyCustomer(0)">启动客户</button> -->
					<button class="cuIcon-comment cu-btn round bg-gradual-red shadow" @tap="toHistory(List.customerid,'customer')">查看历史</button>
					<button class="cuIcon-delete cu-btn round bg-gradual-red shadow animation-scale-up" @tap="toCusAllocate()">分配客户</button>
				</view>
			</view>
		</form>
	</view>
</template>
<script>
	import zhilinPicker from "@/components/zhilin-picker/zhilin-picker.vue"
	
	var api = require('@/common/api.js')
	export default {
		components: {
		   //          yealuoInputs,
					 zhilinPicker,
		        },
		data() {
			return {
				show: false,
				title: '选择员工',
				datalist:[{label:"无客户数据",value:"x"}],
				List:{},
				allowedit:false,
				filterindex:-1,
				customerfilter:'',
				picker:['A','B','C'],
				customerid:'',
				customername:'',
				customerphone:'',
				customeraddress:'',
				customerbirthday:'',
				customerold:'',
				customerbody:'',
				customerinterest:'',
			}
		},		
		onLoad(e) {
			uni.showLoading({
				title:"数据加载中",
			})
			this.customerid=e.customerid
			var customerid = e.customerid	
			api.get({
				url: 'scdetail',
				data: {
					customerid: customerid,
					// device_type: api.DeviceType	
				},
				success: (res) => {
					console.log(res);
					if (res!="") {
						this.loading = false;
						this.List = res
						this.customerfilter = this.List.customerfilter,
						this.customername = this.List.customername,
						this.customerphone = this.List.customerphone,
						this.customeraddress = this.List.customeraddress,
						this.customerbirthday = this.List.customerbirthday,
						this.customerinterest= this.List.customerinterest
						this.customerold = this.List.customerold,
						this.customerbody = this.List.customerbody,
						console.log(res)														
					}else{
					uni.showToast({
						title: '客户不存在',
						icon: "none",
						duration: 1000
					});
					this.List = '';
				}
				}
			});
			api.get({
				url: 'searchwxuser',
				data: {
					openid:uni.getStorageSync("openid"),
					companyid: uni.getStorageSync("companyid"),
					userlevel: uni.getStorageSync("userlevel"),
				},
				success: (res) => {
					uni.hideLoading();
					if (res!="") {
						this.datalist = res
					}else{
					uni.showToast({
						title: '无用户信息',
						icon: "none",
						duration: 1000
					});
					this.list = '';
				}
				}
			});
		},
		methods: {
			PickerChange(e) {
				this.filterindex = e.detail.value
				this.customerfilter=this.picker[this.filterindex]
			},
			toHistory:function(id,type){
				uni.navigateTo({
					url:"../history/history"+"?id="+id+"&type="+type
				})
			},
			onShow: function() {
				console.log('结束通话')
			},
			onHide: function() {
				console.log('开始通话')
			},
			onConfirmLabel(val){
				console.log(val)
			},
			onChange(val){
				console.log(val)
			},
			addHistory:function(){
				let modlist={'customername':'客户姓名','customerphone':'客户电话','customeraddress':'客户地址',
				'customerbirthday':'客户生日','customerold':'客户年龄','customerbody':'客户形体',
				'customerinterest':'客户爱好','customerfilter':'客户分类'			
				};
				for(let field in modlist){
					var at=this;
					var bf=this.List	
					if(bf[field]!=at[field]){
						console.log(field,modlist[field],"改变")
						this.addhistoryapi('customer',at.customerid,modlist[field],bf[field],at[field])
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
			confirmCustomer(customerid){
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
							console.log(this.customerid)
							api.get({
								url: 'updatecustomerinfo',
								data: {
									customerid: customerid,
									customername : this.customername,
									customerphone : this.customerphone,
									customeraddress : this.customeraddress,
									customerbirthday : this.customerbirthday,
									customerold : this.customerold,
									customerbody : this.customerbody,
									customerinterest : this.customerinterest,
									customerfilter	:	this.customerfilter
								},
								success: (res) => {
									console.log(res);
									if (res.code="success") {
										this.loading = false;
										uni.hideLoading();
										this.addHistory();
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
			onConfirm(val){
				console.log(val)
				this.openid=val
				api.get({
					url: 'updateuserbelong',
					data: {
						customerid: this.customerid,
						openid: this.openid,
					},
					success: (res) => {
						// console.log(res.data);
						uni.showToast({
							title: '分配成功',
							icon: "none",
							duration: 1000
						});
					}					
				});
			},
				toCusAllocate(){
					this.show=true
				},
				modifyCustomer(){
					var value =''
					var _this=this
					if(_this.List.customerstate==0){
						value=1
					}else{
						value=0
					}
					uni.showModal({
					    title: '提示',
					    content: '确认要更改客户状态?',
					    success: function (res) {
					        if (res.confirm) {
					            console.log('用户确定更新');
								api.get({
									url: 'modcusstate',
									data: {
										customerid: _this.customerid,
										customerstate: value
									},
									success: (res) => {
										// console.log(res.data);
										uni.showToast({
											title: '修改成功',
											icon: "none",
											duration: 1000
										});
										uni.navigateBack({
											animationDuration:300
										})
									}					
								});
					        } else if (res.cancel) {
					            console.log('用户取消更新');
					        }
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
							this.customerid = '';
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
				call(){
					uni.makePhoneCall({
					
					// 手机号
					phoneNumber: this.List.customerphone, 

					// 成功回调
					success: (res) => {
						this.updateCallTime()
						console.log('调用成功!')	
						
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
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
