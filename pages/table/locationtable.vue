<template>
    <view class="warp">
		<uni-calendar ref="calendar"  :insert="false" :lunar="true" :startDate="'2020-01-01'"
		 :endDate="'2025-12-31'" :range="false" @confirm="onSelected" />
		<!-- <mx-datepicker :show="showPicker" type="range" @confirm="onSelected" :show-seconds="true" @cancel="onCancel" /> -->
		<view class="cu-bar search bg-white" id="search">
			<view class="padding-left-sm">
				<picker :range="searchType">
					<view style="display: flex;align-items: center;">{{searchType[0]}}
						<text class="cuIcon-triangledownfill" style="font-size: 16px;height: 16px;padding-left: 1upx;"></text>
					</view>
				</picker>
			</view>
			<view class="search-form round flex justify-center">
				<view style="border-bottom: 1px solid #d1d1d1;padding-left: 20upx;"
				 @tap="openCalendar">{{startDate}} </view>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @tap="searchSubmit">搜索</button>
			</view>
		</view>
        <view class="box">
            <t-table @change="change">
                <t-tr>
                    <t-th>姓名</t-th>
					<t-th>签到地点</t-th>
                    <t-th>签到时间</t-th>
                    <t-th>签退时间</t-th>
                </t-tr>
                <t-tr v-for="item in tableList" :key="item.name">
                    <t-td>{{ item.name }}</t-td>
					<t-td>{{ item.signaddress ? item.signaddress:"未打卡" }}</t-td>
					<t-td>{{ item.starttime ? item.starttime:"未打卡"}}</t-td>
                    <t-td>{{ item.endtime ? item.endtime:"未打卡"}}</t-td>
                    <!-- <t-td>{{ item.hobby }}</t-td> -->
                </t-tr>
            </t-table>
        </view>
<!--        <view class="box">
            <view class="title">自定义样式</view>
            <t-table border="2" border-color="#95b99e" :is-check="true" @change="change">
                <t-tr font-size="14" color="#95b99e" align="left">
                    <t-th align="left">姓名</t-th>
                    <t-th align="left">年龄</t-th>
                    <t-th align="left">爱好</t-th>
                    <t-th align="center">操作</t-th>
                </t-tr>
                <t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList" :key="item.id">
                    <t-td align="left">{{ item.name }}</t-td>
                    <t-td align="left">{{ item.age }}</t-td>
                    <t-td align="left">{{ item.hobby }}</t-td>
                    <t-td align="left"><button @click="edit(item)">编辑</button></t-td>
                </t-tr>
            </t-table>
        </view> -->
    </view>
</template>
<script>
	var api = require('@/common/api.js');
	
	import tTable from '@/components/t-table/t-table.vue';
    import tTh from '@/components/t-table/t-th.vue';
    import tTr from '@/components/t-table/t-tr.vue';
    import tTd from '@/components/t-table/t-td.vue';
    export default {
        components: {
            tTable,
            tTh,
            tTr,
            tTd
        },
        data() {
            return {
				startDate:new Date().toISOString().slice(0, 10),
				searchType:['日期选择',],
                tableList: [
                ]
            };
        },
		onLoad() {
			this.loadLocation(this.startDate);
		},
        methods: {
			searchSubmit:function(){
				this.loadLocation(this.startDate);
			},
			loadLocation:function(date){
				api.get({
					url: 'searchlocation',
					data: {
						openid:uni.getStorageSync("openid"),
						companyid:uni.getStorageSync("companyid"),
						createtime:date,
					},
					success: (res) => {
						console.log(res);
						if (res!="") {
							this.tableList = res
							console.log(this.tableList)
						}else{
						uni.showToast({
							title: '无打卡信息',
							icon: "none",
							duration: 1000
						});
						this.tableList=""
					}
					}
				});	
			},
			openCalendar(){
				this.$refs.calendar.open();
			},
			onSelected(data) {
				if(data === ""){
					uni.showToast({
						title: '温馨提示,请选择正确的时间范围',
						icon: "none",
						duration: 1000
					});
					return false;
				}
				this.startDate = data.fulldate;
				console.log(data);
			},
            change(e) {
                console.log(e.detail);
            },
            edit(item) {
                uni.showToast({
                    title: item.name,
                    icon: 'none'
                });
            }
        }
    };
</script>

<style>

</style>
