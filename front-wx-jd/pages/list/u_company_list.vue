<template>
	<view  v-if="userlevel==='0'">
		<view class="card-menu cu-list menu">
			<view class="cu-item " @tap="newCompany">
				<view class="content" >
					<text class="text-orange cuIcon-roundrightfill" @tap="newCompany"></text>点击新增公司<text class="text-gray text-sm padding-left-sm" @tap="newCompany">更新时间：2020-12-08</text>
				</view>
			</view>
		</view>
		<scroll-view id="scroll" scroll-y = "true" :style="{height:scrollHeight}">
			<view class="cu-list menu card-menu margin-top-sm">
				<navigator v-for="(item,i) in list" :key="i" class="cu-item" :url="'../detail/companydetail?companyid=' + item.companyid">
					<view class="content padding-tb-sm">
						<view>公司编号：{{item.companyid}}</view>
						<view class="text-gray ">
							  公司名称：{{item.companyname}}
						</view>
						<!-- <view class="text-gray ">
							 公司备注：{{item.companremark}}
						</view> -->
						<view class="text-gray ">
							 创建时间：{{item.createtime}}
						</view>
					</view>
					<view class="action">
						<view class="cu-tag round bg-orange">详情</view>
					</view>
				</navigator>
			</view>
		</scroll-view>

	</view>
	<view  v-else>
		 您无权查看此页面
	</view>	
</template>

<script>
	var api = require('@/common/api.js');
	export default {
		data() {
			return {
				list:[],
				scrollHeight:'',
				userlevel:uni.getStorageSync("userlevel"),
				
			}
		},
		onReady() {
		},
		onLoad(){
			api.get({
				url: 'searchcompany',
				data: {
				},
				success: (res) => {
					// console.log(res.data);
					if (res!="") {
						this.list = res
					}else{
					uni.showToast({
						title: '无任何公司',
						icon: "none",
						duration: 1000
					});
					this.list = '';
				}
				}
			});	
		},
		methods: {
			newCompany(){
				uni.navigateTo({
					url: '/pages/ucenter/u_company_manage'
				})
			},
		}
	}
</script>

<style>

</style>
