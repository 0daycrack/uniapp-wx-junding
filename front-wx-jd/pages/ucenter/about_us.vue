<template>
	<view class="content">
		<view id="title">
			<view class="cu-bar  solid-bottom">
				<view class="action ">
					<text class="cuIcon-friendfill text-blue"></text><text class="title">企业管理系统</text> 
				</view>
			</view>
		</view>
		<view id="connect" class="margin-top-xs">
			<rich-text>简单的企业管理系统，能胜任基本的管理需求，易于用户进行二次开发。</rich-text>
		</view>
		<view id="connect" class="margin-top-xs">
			<rich-text></rich-text>
			<rich-text>（开发者）微信：<text style="font-size: 36upx;color:orange;">ljw39944254</text></rich-text>
		</view>
	</view>
</template>

<script>
	var api = require('@/common/api.js');
	export default {
		data() {
			return {
				nodes:'',
				title:''
			}
		},
		onLoad() {
			
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		height: 100%;
		background: #fff;
	}
	.content{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;
	}
</style>
