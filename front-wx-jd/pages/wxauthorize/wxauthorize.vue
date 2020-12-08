<template>
    <view>
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="isCanUse">
            <view>
                <view class='header'>
                    <image src='../../static/wx_login.png'></image>
                </view>
                <view class='content'>
                    <view>申请获取以下权限</view>
                    <text>获得你的公开信息(昵称，头像、地区等)</text>
                </view>

                <button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
                    授权登录
                </button>
            </view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
	var api = require('@/common/api.js');
    export default {
        data() {
            return {
                SessionKey: '',
                openid: '',
                nickName: null,
                avatarUrl: null,
                isCanUse: true//默认为true
            };
        },
        methods: {
            //第一授权获取用户信息===》按钮触发
            wxGetUserInfo() {
                let _this = this;
                uni.getUserInfo({
                    provider: 'weixin',
                    success: function(infoRes) {
                        let nickName = infoRes.userInfo.nickName; //昵称
                        let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						uni.setStorageSync('nickname',nickName)
						uni.setStorageSync('avatarurl',avatarUrl)
                        try {
                            uni.setStorageSync('isCanUse', false);//记录是否第一次授权  false:表示不是第一次授权
							console.log(uni.getStorageSync("isCanUse"))
                            _this.updateUserInfo();
                        } catch (e) {}
                    },
                    fail(res) {}
                });
            },

　　　　　　//登录
                login() {
                let _this = this;
				let result=uni.getStorageSync('isCanUse')					
				if(result.length==0){
					console.log("无登录记录")
					_this.isCanUse=true					
				}else{
					_this.isCanUse=false
				}
								
				console.log(_this.isCanUse)
							
                uni.showLoading({
                    title: '登录中...'
                });
             
               // 1.wx获取登录用户code
                uni.login({
                    provider: 'weixin',
                    success: function(loginRes) {						
                        let code = loginRes.code;
						console.log(code);
						console.log(_this.isCanUse);
                        if (!_this.isCanUse) {
                            //非第一次授权获取用户信息
                            uni.getUserInfo({
                                provider: 'weixin',
                                success: function(infoRes) {
 　　　　　　　　　　　　　　　　　　　　　　//获取用户信息后向调用信息更新方法
                                    let nickName = infoRes.userInfo.nickName; //昵称
                                    let avatarUrl = infoRes.userInfo.avatarUrl; //头像
									uni.setStorageSync('nickname',nickName)
									uni.setStorageSync('avatarurl',avatarUrl)
									//调用更新信息方法
                                }
                            });
                        }
						
                        //2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
                        api.get({
                        	//url: 'https://www.ucharts.cn/data.json',
                        	url: 'login',
                        	data:{
                        		code: code,
                        	},
                        	success: function(res) {
								console.log(res)
								// 存储姓名 头像 openid  全局登录状态到全局空间中
								uni.setStorageSync('token', res['token'])
								uni.setStorageSync('openid', res['openid'])
								uni.setStorageSync('session_key',res['session_key'])
								uni.setStorageSync('login', 1)

								console.log(uni.getStorageSync('nickname'))
								console.log(uni.getStorageSync('avatarurl'))
								// 判断是否为新用户，如果为新用户，直接跳转到新用户注册页面
								if (res['userstat']==0){
									_this.isCanUse=true
									console.log(_this.isCanUse)
									uni.reLaunch({//信息更新成功后跳转到小程序首页
									    url: '/pages/register/register'
									});
									setTimeout((e => {
										uni.navigateBack();
									}), 2500);
								}
								_this.openid=res['openid']
                                //openId、或SessionKdy存储//隐藏loading
                                uni.hideLoading();
								if(!_this.isCanUse){
									_this.updateUserInfo();									
								}							
                        	},
                        	fail: () => {
                        		uni.showToast({
                        			title:"网络错误,请检查网络"
                        		})
                        	},
                        });
                    },
                });
            },
         //向后台更新信息
            updateUserInfo() {
				console.log("updateuser")
                let _this = this;
				api.get({
					//url: 'https://www.ucharts.cn/data.json',
					url: 'getuserinfo',
					data:{
						// appKey: this.$store.state.appKey,
						openid: _this.openid,
						nickName: _this.nickName,
						headUrl: _this.avatarUrl
					},
					success: function(res) {
						console.log(res)
						console.log(res)						
						uni.setStorageSync('userlevel',res['level'])
						uni.setStorageSync('companyid',res['companyid'])
						console.log(uni.getStorageSync('userlevel'))
												
                        if (res != null) {							
                            uni.reLaunch({//信息更新成功后跳转到小程序首页
                                url: '/pages/index/index'
                            });
                        }
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
            }
        },
        onLoad() {//默认加载
            this.login();
        }
    }
</script>

<style>
    .header {
        margin: 90rpx 0 90rpx 50rpx;
        border-bottom: 1px solid #ccc;
        text-align: center;
        width: 650rpx;
        height: 300rpx;
        line-height: 450rpx;
    }

    .header image {
        width: 200rpx;
        height: 200rpx;
    }

    .content {
        margin-left: 50rpx;
        margin-bottom: 90rpx;
    }

    .content text {
        display: block;
        color: #9d9d9d;
        margin-top: 40rpx;
    }

    .bottom {
        border-radius: 80rpx;
        margin: 70rpx 50rpx;
        font-size: 35rpx;
    }
</style>