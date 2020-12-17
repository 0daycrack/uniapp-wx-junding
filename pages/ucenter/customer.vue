<template>
	<view class="padding-top">
		<form class="" @submit="formSubmit">
			<view class="card-menu cu-list menu">
				<view class="cu-item ">
					<view class="content">
						<text class="text-orange cuIcon-roundrightfill"></text>新增客户
					</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">客户编号<text class="text-red"></text></view>
					<input placeholder="客户编号（非必须，后台会自动生成）" name="sn" disabled="disabled"></input>
					<!-- <button class='cu-btn bg-green shadow'>上传识别</button> -->
				</view>				
				<view class="cu-form-group">
					<view class="title">客户姓名<text class="text-red">*</text></view>
					<input placeholder="请输入客户姓名" name="name"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">手机号<text class="text-red">*</text></view>
					<input placeholder="手机号" name="phone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">客户分类</view>
					<text class="text-red">*</text>
					<picker @change="PickerChange" :value="index" :range="picker" name='cusfilter'>
						<view class="picker">
							{{index>-1?picker[index]:'请选择客户类别'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">来源<text class="text-red">*</text></view>
					<!-- <input placeholder="来源" name="from"></input> -->
					<picker @change="fromChange" :value="fromindex" :range="frompicker" name='from'>
						<view class="picker">
							{{fromindex>-1?frompicker[fromindex]:'请选择客户来源'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">年龄<text class="text-red">*</text></view>
					<input placeholder="年龄" name="old" type="number"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">客户地址<text class="text-red"></text></view>
					<input placeholder="客户地址" name="address"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">生日<text class="text-red"></text></view>
					<input placeholder="生日" name="birthday"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">体态特征<text class="text-red"></text></view>
					<input placeholder="体态特征" name="body"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">兴趣爱好<text class="text-red"></text></view>
					<input placeholder="兴趣爱好" name="interest"></input>
				</view>

				<view class="cu-bar bg-white" v-if="false">
					<view class="action">
						图片上传
					</view>
					<view class="action">
						{{imgList.length}}/4
					</view>
				</view>
				<view class="cu-form-group" v-if="false">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						 <image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
				
				<view class="cu-form-group">
					<view class="title">备注信息</view>
					<input placeholder="备注" name="desc"></input>
				</view>

				<view class="cu-form-group ">
					<button class="cu-btn bg-blue shadow" form-type="submit":loading="loading">提交信息</button>
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
				picker: ['A','B','C'],
				frompicker:['客户转推',
							'异业介绍',
							'自然客流',
							'主动营销',
							'线上推广'],
				index:-1,
				fromindex: -1,
				loading: false
			}
		},
		onLoad() {			
			
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
				},
			fromChange(e){
				this.fromindex=e.detail.value
			},						
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
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
				uni.uploadFile({
				    url:"http://0.0.0.0:8000/uploadfile",     // 后端api接口
				    filePath: this.imgList, // uni.chooseImage函数调用后获取的本地文件路劲
				    name:'file',     //后端通过'file'获取上传的文件对象
				    formData: {openid:uni.getStorageSync("openid")},
				    header:{"Content-Type": "multipart/form-data"},
				    success:(res) => {
				        if (res.data.code == 200){
				            console.log('文件上传成功')
				        }
				    }
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
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
			formSubmit(e){
				var params = e.detail.value;
					console.log(params)
				if (params['name'] == '') {
					uni.showToast({
						title: '名称不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['old'] =='') {
					uni.showToast({
						title: '客户年龄不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['from'] == -1) {
					uni.showToast({
						title: '客户来源不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['phone'] == '') {
					uni.showToast({
						title: '电话不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				if (params['cusfilter'] == -1) {
					uni.showToast({
						title: '客户分类不能为空',
						duration: 1500,
						icon: "none"
					});
					return false
				}
				this.loading = true;
				api.get({
					url: 'customerform',
					data: {        
						openid:uni.getStorageSync('openid'),
						customername:params['name'],
						customerphone: params['phone'],
						customerfilter: this.picker[params['cusfilter']],
						customeraddress: params['address'],
						customerbirthday: params['birthday'],
						customerold : params['old'],
						customerbody:params['body'],
						customerfrom:this.frompicker[params['from']],
						customerinterest:params['interest'],
						customerimage:"待更新",
						customercalltime:0,
						//0未成交，1已成交
						customerstate:0,
						//0启用，1禁用
						customeractive:0,
						customerremark: params['desc'],
						companyid:uni.getStorageSync('companyid'),
						// device_type : api.DeviceType
					},
					method: 'GET',
					header: {
					    'content-type': 'application/json'
					},
					success: (res) => {
						if (res != "") {
							this.loading = false;
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: 'success'
							});
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
								//url: '../grid/grid'
							});
							setTimeout((e => {
								uni.navigateBack();
							}), 2500);
						}
						if (res == "") {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '添加失败'
							});
						}
					}
				});					
			}				
		}
	}
</script>

<style lang="scss">
	.evan-form-show {
		padding: 0 30rpx;

		.form-input {
			font-size: 28rpx;
			color: #333;
			text-align: right;
		}

		.form-input-placeholder {
			font-size: 28rpx;
			color: #999
		}

		&__button {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			font-size: 36rpx;
			color: #fff;
			margin-top: 20rpx;
			background-color: #4790EF;

			&::before,
			&::after {
				border: none;
			}
		}

		.customize-form-item {
			&__label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
			}

			&__radio {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				&__text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>
