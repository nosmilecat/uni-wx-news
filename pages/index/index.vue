<template>
  <div class="view">
    <div class="tab">
      <scroll-view class="nav" :scroll-x="true" :scroll-left="scrollLeft">
        <block v-for="(item,index) in allTitle" :key="index">
          <view class="nav-item" :class="{'active': currentIndex==item.id}" :data-current="item.id" @tap="changeTitle">{{item.title}}</view>
        </block>
      </scroll-view>
      <swiper class="content-container" :current="currentIndex" :circular="false" @change="changeContent($event)">
        <swiper-item class="content">
          <scroll-view
            class="scroll-container"
            :scroll-y="true"
			:style="{height}"
            refresher-default-style="none"
            :refresher-triggered="triggered"
            :refresher-threshold="threshold"
            :refresher-enabled="true"
            @scrolltolower="tolower"
            @refresherrefresh="refresh"
            @refresherrestore="onRestore"
            @refresherabort="onAbort"
          >
            <div slot="refresher" class="refresh-container"
              style="width: 100%; height: 45px; background: #fff; display: flex; align-items: center;"
            >
              <div class="down-loading">
                <view class="loading-image" :animation="animation"><image src="/static/loading.png"></image></view>
				{{downText}}
              </div>
            </div>
			<div class="hot-news">
				<div class="hot-more">
					<div class="bold">热点精选</div>
					<div @tap="hotMore">查看更多</div>
				</div>
			    <scroll-view  class="hot-news-box" :scroll-x="true">
					<block v-for="(item,index) in hotNews" :key="index">
					  <view :style="'background: url(' + item.newsImg + ') center no-repeat; background-size:cover;'" class="hot-news-item">
						<div class="text">
							<p>{{item.newsTitle}}</p>
							<!-- <p class="mask">{{item.newsSourceName}} {{item.newsDate}}</p> -->
						</div>	
					  </view>
					</block>
			    </scroll-view>
			</div>
            <div v-for="(item,index) in newList" :key="index">
				<div class="news_panel">
					<div class="brand">
					  <image class="brand_icon" :src="item.newsImg" mode="widthFix"></image>
					  <span class="brand_name">{{item.newsSourceName}}</span>
					</div>
					<navigator :url="'/pages/newsDetail/index?id=' + item.id" hover-class="navigator-hover">
						<div class="news_title">{{item.newsTitle}}</div>
						<div class="news_content">
						  <div class="text">{{item.newsContent}}</div>
						  <image class="brand_icon" :src="item.newsImg" mode="widthFix"></image>
						</div>
					</navigator>
					<div class="news_foot">
					  <button class="box"><span class="icon-liaotian iconfont"></span><span>2000</span></button>
					  <button class="box" open-type="share" :data-new="item"><span class="icon-weixin iconfont"></span>好友</button>
					  <button class="box" @tap="createHb(item.newsTitle, item.newsImg)"><span class="icon-shengchenghaibao iconfont"></span>海报</button>
					</div>
				</div>
            </div>
            <div class="load_more">
              <uni-load-more :iconSize="18" :status="loadmore" :showIcon="true" :contentText="contentText" />
            </div>
          </scroll-view>
        </swiper-item>
        <swiper-item class="content">本地</swiper-item>
      </swiper>
    </div>
	<div class="canvas-box">
		<canvas canvas-id="hbCanvas"></canvas>
	</div>
  </div>
</template>

<script>
import uniLoadMore from "@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue"
import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue"
export default {
  data () {
    return {
      triggered: false,
      isAuthorize: false,
	  animation:{},
	  avator: '',
      loadmore: 'loading',
	  height: '100%',
	  downText: "下拉刷新",
	  contentText:{
		contentdown: "上拉显示更多",
		contentrefresh: "正在加载...",
		contentnomore: "没有更多数据了"
	  },
	  current: 1,
	  hotNews: [],
      threshold: 45,
      newList: [],
      allTitle: [
        {id: 0, title: '推荐'},
        {id: 1, title: '本地'}
      ],
      currentIndex: 0, // 当前选中标题的下标
      scrollLeft: 0 // tab滚动条的位置
    }
  },

  components: {
    uniLoadMore,
	uniIcons
  },
  onShareAppMessage(res) {
	  if (res.from === 'button') {
		// 来自页面内转发按钮
		let news = res.target.dataset.new;
		return {
			title: news.newsTitle,
			imageUrl: news.newsImg,
			path: '/pages/newsDetail/index?id=' + news.id
		}
	  }
	  return {
	  	title: '全球资讯',
	  	path: 'pages/index/index'
	  }
	  
  },
  
  onPullDownRefresh () {  
	  // h5使用的下拉刷新
	  this.current = 1;
	  this.newList = [];
	  this.loadmore = 'loading';
	  this.getNewsList().then(()=>{
		  uni.stopPullDownRefresh();
	  })
  },
  methods: {
    // 点击切换标题
    changeTitle (event) {
      let index = event.target.dataset.current// 当前点击标题的index
      this.currentIndex = index
    },
    // 滑动切换内容
    changeContent (event) {
      let current = event.target.current
      let singleNavWidth = wx.getSystemInfoSync().windowWidth / 5
      this.currentIndex = current
      this.scrollLeft = (current - 2) * singleNavWidth
    },
	async getHotNewsList() {
		let result = await this.$axios.post('/news/getHotSelectionsList');
		this.hotNews = result;
	},
	async getNewsList() {
		let current = this.current;
		let result = await this.$axios.post('/news/getNewsList', {
			current,
			size: 5
		})
		this.newList = this.newList.concat(result.rows);
		if(result.rows.length < 5) {
			this.loadmore = 'noMore';
		}
	},
    refresh () {
		if (this._freshing) return;
		this._freshing = true;
		this.downText = "刷新中";
		this.current = 1;
		this.newList = [];
		this.hotNews = [];
		this.loadmore = 'loading';
		let allRequires = [];
		let require1 = this.$axios.post('/news/getNewsList', {
			current: this.current,
			size: 5
		});
		let require2 = this.$axios.post('/news/getHotSelectionsList');
		allRequires.push(require1,require2);
		Promise.all(allRequires).then( res => {
		    console.log(res);
			this.hotNews = res[1];
			this.newList = this.newList.concat(res[0].rows);
			if(res[0].rows.length < 5) {
				this.loadmore = 'noMore';
			}
			this.triggered = false;
			this._freshing = false;
			this.downText = "下拉刷新";
		})
		
    },
    tolower () {
		if(this.loadmore === 'noMore') {
			return
		}
        this.current = this.current + 1;
        this.getNewsList();
    },
    onRestore (e) {
      console.log('onRestore:', e)
	  // this.triggered = 'restore';
    },

    onAbort (e) {
      console.log('onAbort', e)
    },
	hotMore () {
	  uni.navigateTo({
	  	url: '/pages/hotNews/index'
	  })
	},
	createHb(title, url) {
		if(this.isAuthorize) {
		  let ctx = this.ctx;
		  ctx.clearRect(0, 0, uni.getSystemInfoSync().windowWidth, 500);
		  ctx.draw(true);
		  uni.downloadFile({
			url: url,  
			success: (res)=> {  
			  if (res.statusCode === 200) {
				  console.log(res.tempFilePath)
				  ctx.setFillStyle('#fff');
				  ctx.rect(0, 0, uni.getSystemInfoSync().windowWidth, 450);
				  ctx.fill();
				  ctx.drawImage(res.tempFilePath, 0, 0, uni.getSystemInfoSync().windowWidth, 300);
				  ctx.draw(false, ()=>{
					  ctx.setFontSize(20);
					  ctx.setFillStyle('black');
					  let fontsHeight = 0;
					  let secondLineTitle = '';
					  ctx.fillText(title.slice(0, 16), 20, 330);
					  console.log(title.length)
					  if( title.length > 16 ){
						fontsHeight = 30;
						secondLineTitle = title.slice(16, 32);
					  }
					  if( title.length > 32 ){
						secondLineTitle += '...';
					  }
					  ctx.fillText(secondLineTitle, 20, 330 + fontsHeight);
					  // ctx.draw(true);
					  ctx.setStrokeStyle('#eaeaea');
					  ctx.moveTo(0, 350 + fontsHeight);
					  ctx.lineTo(uni.getSystemInfoSync().windowWidth, 350 + fontsHeight);
					  ctx.stroke();
					  ctx.draw(true);
					  ctx.arc(35, 385 + fontsHeight, 15, 0, Math.PI * 2);
					  ctx.setFillStyle('#fff');
					  ctx.fill();
					  ctx.clip();
					  ctx.drawImage(this.avator, 20, 370 + fontsHeight, 30, 30);
					  ctx.draw(true, ()=>{
						  console.log('drawCallback')
						  uni.canvasToTempFilePath({
							canvasId: 'hbCanvas',
							success: (res2)=> {
								console.log(res2.tempFilePath)
								uni.saveImageToPhotosAlbum({
									filePath: res2.tempFilePath,
									success: ()=> {
										uni.previewImage({
											current:'0',
											urls: [res2.tempFilePath]
										});
										uni.showToast({
											title: '已保存至相册',
											duration: 2000
										})
									},
									fail: ()=> {
										uni.showToast({
											title: '保存失败',
											duration: 2000
										})
									}
								});
							},
							fail: ()=> {
								uni.showToast({
									title: '海报生成失败',
									duration: 2000
								})
							}
						  })
					  });
				  });
				  
				  // 生成图片
				  
				  
			  }
			},
			fail: (err)=> {
			  console.log(err)
			}
		  }); 
		} else {
		  uni.showModal({
			  title: '提示',
			  content: '生成海报需要授权使用您的微信头像、昵称等用户信息，是否进行授权？',
			  success: (res)=> {
				  if (res.confirm) {
					  uni.navigateTo({
						url: '/pages/authorize/index'
					  })
				  } 
			  }
		  });
		}
	  
	},
	userAuthorize() {
		//#ifndef H5
		// 判断用户是否授权
		uni.getSetting({
		   success:(res)=> {
		      console.log(res.authSetting)
			  if(res.authSetting['scope.userInfo']) {
				  this.isAuthorize = true;	
				  uni.getUserInfo({
				  	success: (infoRes)=>{
						console.log(infoRes)
						uni.getImageInfo({
						  src: infoRes.userInfo.avatarUrl,  
						  success: (res)=> {  
							  this.avator = res.path;
							  console.log('avator', this.avator)
						  },
						  fail: (err)=> {
							  console.log(err)
						  }
						}); 
					}
				  })
			  } 
		   }
		});
		//#endif	  
	}
  },
	
  created () {
	let animation = uni.createAnimation({
	  duration: 1000,
	  timingFunction: "linear",
	  delay: 0,
	  transformOrigin: "50% 50% 0"
	})
	let i = 0;
	setInterval(()=>{
		i = i + 1;
		animation.rotate(180*i).step();
		this.animation = animation.export();
	},1000)
	this.ctx = uni.createCanvasContext('hbCanvas');
	this.triggered = true;
	this.userAuthorize();
	this.getHotNewsList();
	this.getNewsList();
  }
}
</script>

<style scoped>

.view {
	width: 100%;
  height: 100%;
  position: relative;
  /* background: #e5e5e5; */
}

.tab {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav {
  height: 80upx;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  white-space: nowrap;
  line-height: 80upx;
  font-size: 32upx;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}


.nav-item {
  width: 20%;
  display: inline-block;
  text-align: center;
}

.active {
  color: #000;
  font-weight: 700;
  position: relative;
}

.active:after{
  content: "";
  display: block;
  width:100%;
  height: 5upx;
  border-radius: 8upx;
  background: #000;
  position: absolute;
  bottom: 0;
}

.content-container {
  width: 100%;
  flex: 1;
  text-align: center;
	margin-top: 80upx;
}
.scroll-container {
  /* height: 400px; */
}
.content{
  
}


.news_panel {
  /* height: 420upx; */
  margin-top: 10upx;
  background: #fff;
  padding: 20upx;
  border-bottom: 6upx solid #e5e5e5;
}
.news_panel .brand {
  /* height: 60upx; */
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 24upx;
}
.news_panel .brand .brand_icon {
  width: 50upx;
  height: auto;
  margin-right: 10upx;
}
.news_panel .news_title {
  margin-top: 8upx;
  font-size: 32upx;
  text-align: left;
}
.news_panel .news_content {
  margin-top: 10upx;
  font-size: 30upx;
  text-align: left;
  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: top;
  line-height: 46upx;
  height: 140upx;
  overflow: hidden;
}
.news_panel .news_content .text {
  width: 400upx;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.news_panel .news_content image {
  width: 260upx;
}
.news_panel .news_foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10upx;
  font-size: 30upx;
  margin-top: 20upx;
}
.news_panel .news_foot button {
  background-color: #fff;
  line-height: 1;
}
.news_panel .news_foot button::after {
  border: none;
}
.news_panel .news_foot .box {
  font-size: 26upx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.news_panel .news_foot .iconfont {
  font-size: 42upx;
  margin-right: 10upx;
}

.hot-news {
	border-bottom: 6upx solid #e5e5e5;
	padding: 20upx;
}

.hot-news .hot-more {
	display: flex;
	height: 80upx;
	padding: 0 10upx;
	justify-content: space-between;
	align-items: center;
	font-size: 24upx;
}
.hot-news .hot-more .bold {
	font-weight: 700;
	font-size: 28upx;
}

.hot-news-box {
	width: 100%;
	height: 400upx;
	white-space: nowrap;
}

.hot-news-item {
	width: 650upx;
	height: 400upx;
	background: #4CD964;
	display: inline-block;
	margin-right: 12upx;
	border-radius: 15upx;
	position: relative;
	white-space: normal;
}
.hot-news-item .text {
	position: absolute;
	padding: 30upx;
	left: 0;
	bottom: 0;
	color: #fff;
	text-align: left;
	font-size: 28upx;
	font-weight: 700;
}
.hot-news-item .text .mask{
	font-size: 24upx;
	color: #E5E5E5;
	font-weight: 400;
}

.down-loading {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute; 
	width: 100%; 
	font-size: 24upx;
}
.loading-image {
	width: 32upx;
	height: 32upx;
	display: inline-block;
	margin-right: 16upx;
}
.loading-image image {
	width: 100%;
	height: 100%;
}
.canvas-box {
	width: 100%;
	height: 100%;
	position: absolute;
	top:999999999999999999999upx;
}
.create-btn {
	position: absolute;
	bottom: 0;
	left: 50%;
}
canvas {
	width: 100%;
	height: 100%;
}
/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
