<template>
  <div class="signin">
    <view class="location">
      <van-cell class="field-cell"
        required
        title-width="70px"
        title="当前定位：">
        <view v-if="formData.signAddress"
          class="location">
          {{ formData.signAddress }}
        </view>
        <view v-if="location.error"
          class="error">
          {{ location.errorInfo }}
        </view>
        <van-loading v-if="location.loading"
          size="26rpx">
          定位中...
        </van-loading>
        <van-button v-if="location.error"
          slot="right-icon"
          type="primary"
          size="mini"
          @click="getLocation">
          重试
        </van-button>
        <van-button v-if="location.curLocation"
          slot="right-icon"
          type="primary"
          size="mini"
          @click="handleSelect">
          位置微调
        </van-button>
      </van-cell>
    </view>
    <view class="signin-area">
      <van-button class="signin-btn"
        type="primary"
        round
        :disabled="signin.isSigninOn"
        @click="handleSignin(0)">
        <view class="label">上班签到</view>
        <view class="time">{{ signin.time }}</view>
      </van-button>
      <view class="signin-result">
        <van-icon v-if="signin.isSigninOn"
          name="checked"
          size="30rpx"
          color="#4cd964"
          style="margin-right:10rpx" />
        <text v-if="signin.isSigninOn">今日您已签到:{{ signin.signOnTime }}</text>
        <text v-else>今日您还未签到</text>
      </view>
    </view>
	<view class="signin-area">
	  <van-button class="signin-btn"
	    type="primary"
	    round
	    :disabled="signin.isSigninOff"
	    @click="handleSignin(1)">
	    <view class="label">下班签退</view>
	    <view class="time">{{ signin.time }}</view>
	  </van-button>
	  <view class="signin-result">
	    <van-icon v-if="signin.isSigninOff"
	      name="checked"
	      size="30rpx"
	      color="#4cd964"
	      style="margin-right:10rpx" />
	    <text v-if="signin.isSigninOff">今日您已签到:{{ signin.signOffTime }}</text>
	    <text v-else>今日您还未签到</text>
	  </view>
	</view>
  </div>
</template>

<script>
import { formatDate, reverseGeocoder, getLocation } from '@/utils'
import { mapGetters, mapMutations } from 'vuex'
var api = require('@/common/api.js');
export default {
  data () {
    return {
		date: new Date().toISOString().slice(0, 10),
			signin: {
				time: '', // 签到时间
				count: 0, // 签到时间
				isSigninOn: false ,//是否签到
				isSigninOff: false,
				signOnTime:'',
				signOffTime:'',
			},
      formData: {
        signAddress: '', // 签到地址
        longitude: '', // 经度
        latitude: '' // 维度
			},
			location: {
				loading: true,
				error: false,
				errorInfo: '定位失败',
				curLocation: null // 当前位置信息
			}
    }
  },
  computed: {
    ...mapGetters(['selectedLocation', 'selectedSearch'])
  },
  onLoad () {	 
	// console.log(this.date)
	this.getHisLoc(this.date)
    this.getLocation()
    this.getTime()
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    } else {
      this.timerInterval = setInterval(this.getTime, 1000)
    }
  },
  methods: {
    ...mapMutations(['SET_SELECTED_SEARCH']),
    // 签到
    handleSignin (val) {
      if (!this.location.curLocation) {
        this.getLocation()
      } else {
				clearInterval(this.timerInterval)
				this.signin.count++
				
				if(val==0){
					this.signin.isSigninOn= true
				}else{
					this.signin.isSigninOff= true
				}
				this.getTime(new Date())
				this.saveLocation(val)
				uni.showToast({
					title: '签到成功',
					icon: 'success'
        })
        console.log('签到数据：', this.formData)
			}
    },
	
	getHisLoc(date){
		api.get({
			url: 'gethislocinfo',
			data: {
				openid:uni.getStorageSync("openid"),
				companyid:uni.getStorageSync("companyid"),
				date:date,
			},
			success: (res) => {
				// console.log(res.data);
				if (res!="") {
					if(res.oncount!=0){
						this.signin.isSigninOn=true//是否签到
						this.signin.signOnTime=res.onloctime//是否签到
					}
					if(res.offcount!=0){
						this.signin.isSigninOff=true
						this.signin.signOffTime=res.offloctime
					}
					console.log(res)														
				}else{
				uni.showToast({
					title: '获取数据失败',
					icon: "none",
					duration: 1000
				});
			}
			}
		});	
	},
	
	// 存入数据库
	
	saveLocation(type){
		api.get({
			url: 'savelocation',
			data: {
				openid:uni.getStorageSync("openid"),
				companyid:uni.getStorageSync("companyid"),
				longitude:this.formData['longitude'],
				latitude:this.formData['latitude'],
				signaddress:this.formData['signAddress'],
				type:type,
			},
			success: (res) => {
				// console.log(res.data);
				if (res!="") {
					console.log(res)														
				}else{
				uni.showToast({
					title: '写入数据失败',
					icon: "none",
					duration: 1000
				});
			}
			}
		});	
	},
    // 获取当前时间时分秒
    getTime (time) {
      time = time ? new Date(time) : new Date()
      this.signin.time = formatDate(time, 'HH:mm:ss')
    },
    // 获取当前定位
    getLocation () {
			this.location.loading = true
			this.location.error = false
      getLocation()
        .then(res => {
					const { longitude, latitude } = res
					this.getLocationInfo({ longitude, latitude })
        })
        .catch(() => {
          this.location.loading = false
          this.location.error = true
        })
    },
    // 获取位置信息
    getLocationInfo (location) {
      reverseGeocoder(location)
        .then(res => {
          console.log('当前位置信息：', res)
          const address = res.result.pois[0].title
					this.formData.signAddress = address
					this.location.curLocation = res.result
          this.location.error = false
          this.location.loading = false
        })
        .catch(err => {
          this.location.loading = false
          this.location.error = true
        })
    },
    // 位置微调
    handleSelect () {
      if (this.location.curLocation) {
        const { lng, lat } = this.location.curLocation.location
		console.log(this.location.curLocation.location)
        if (this.selectedSearch && (this.selectedSearch.location.lng !== lng || this.selectedSearch.location.lat !== lat)) {
          this.SET_SELECTED_SEARCH(null)
        }
        uni.navigateTo({
        	url: '../select/select?longitude=${lng}&latitude=${lat}'						
        })
      } else {
        this.getLocation()
      }
    }
  },
  watch: {
    selectedLocation (newData) {
      if (newData) {
        const { title, location } = newData
        this.formData.signAddress = title
        this.formData.longitude = location.lng
        this.formData.latitude = location.lat
        this.location.curLocation = newData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.signin {
  /deep/ .field-cell {
    .cell-field {
      .van-cell {
        padding: 0;
      }
    }
    .van-cell__value {
      display: flex;
      align-items: center;
      .location {
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
      }
    }
  }
  .signin-area {
    padding-top: 100rpx;
    text-align: center;
    /deep/ .signin-btn {
      .van-button {
        width: 260rpx;
        height: 260rpx;
        box-shadow: 0px 12rpx 30rpx 0px rgba(25, 137, 250, 0.34);
      }
      .label {
        font-size: 30rpx;
        line-height: 42rpx;
        color: $uni-text-color-inverse;
      }
      .time {
        font-size: 40rpx;
        line-height: 56rpx;
      }
    }
    .signin-result {
      color: $uni-text-color-grey;
      font-size: 24rpx;
      line-height: 34rpx;
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
