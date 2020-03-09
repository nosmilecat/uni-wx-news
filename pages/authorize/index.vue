<template>
  <div class="view">
	<div>小程序将使用您的微信头像、昵称等用户信息，请授权获取头像昵称</div>
    <button type="primary" class="userInfoBtn" open-type="getUserInfo" @getuserinfo="getuserinfo">授权获取头像昵称</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
		userInfo:{},
	}
  },

  components: {
     
  },
	  
  methods:{
	  getuserinfo(infoRes){
		  uni.getSetting({
		     success:(res)=> {
		        console.log(res.authSetting)
		  	  if(res.authSetting['scope.userInfo']) {
		  		  this.setuserinfo();
		  	  } else {
		  		  uni.showModal({
		  		      title: '提示',
		  		      content: '您已取消授权，是否重新进行授权？',
		  		      success: (res)=> {
		  		          if (res.confirm) {
		  		              uni.openSetting({
		  		                 success:(res)=> {
		  		                    if(res.authSetting['scope.userInfo']) {
									  this.setuserinfo();
		  		                    }
		  		                 }
		  		              })
		  		          } else if (res.cancel) {
		  		              uni.switchTab({
		  		              	url: '/pages/index/index'
		  		              })
		  		          }
		  		      }
		  		  });
		  	  }
		     }
		  });
	  },
	  setuserinfo() {
		  uni.getUserInfo({
		  	success: (infoRes)=>{
				console.log(infoRes)
				uni.setStorage({
					key: 'userInfo',
					data: infoRes.userInfo,
					success: ()=> {
						uni.switchTab({
							url: '/pages/index/index'
						})
					},
					fail: ()=>{
					  
					}
				});
			}
		  })
	  }
  },

  created () {
    
  }
}
</script>

<style scoped>
	.view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 40upx;
		box-sizing: border-box;
		line-height: 60upx;
	}
	.userInfoBtn {
		width: 100%;
		margin-top: 30upx;
	}
</style>
