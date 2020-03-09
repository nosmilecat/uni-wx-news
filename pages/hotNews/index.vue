<template>
  <div class="view">
	  <scroll-view
		class="scroll-container"
		:scroll-y="true"
		:style="{height}"
		@scrolltolower="tolower"
	  >
		<div v-for="(item,index) in newList" :key="index">
		  <div class="news_panel">
			<div class="news_content">
			  <div class="news_title">{{item.newsTitle}}</div>
			  <image :src="item.newsImg"></image>
			</div>
			<div class="brand">
			  <span class="name">{{item.newsSourceName}}</span>
			  <span>{{item.newsDate}}</span>
			</div>
		  </div>
		</div>
		<div class="load_more">
		  <uni-load-more :iconSize="18" :status="loadmore" :showIcon="true" :contentText="contentText" />
		</div>
	  </scroll-view>
	<div class="canvas-box">
		<canvas canvas-id="hbCanvas"></canvas>
	</div>
  </div>
</template>

<script>
import uniLoadMore from "@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue"
import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue"
import axios from '@/request/index.js'
export default {
  data () {
    return {
	  userInfo:{},
      loadmore: 'loading',
	  height: '100%',
	  contentText:{
		contentdown: "上拉显示更多",
		contentrefresh: "正在加载...",
		contentnomore: "没有更多数据了"
	  },
      newList: [],
      allTitle: [
        {id: 0, title: '推荐'},
        {id: 1, title: '本地'}
      ],
	  current: 1,
      currentIndex: 0, // 当前选中标题的下标
      scrollLeft: 0 // tab滚动条的位置
    }
  },

  components: {
    uniLoadMore,
	uniIcons
  },
  methods: {
	  async getNewsList() {
		let current = this.current;
		let result = await axios.post('/news/getHotNewsList', {
			current,
			size: 5
		})
		this.newList = this.newList.concat(result.rows);
		if(result.rows.length < 5) {
			this.loadmore = 'noMore';
		}
	  },
	  tolower () {
	  	if(this.loadmore === 'noMore') {
	  		return
	  	}
	    this.current = this.current + 1;
	    this.getNewsList();
	  },
  },
	
  created () {
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
  font-size: 16px;
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
  color: rgba(0,0,0,.6);
  margin-top: 20upx; 
}

.news_panel .brand .name {
	margin-right: 20upx;
}

.news_panel .news_title {
  width: 450upx;
  margin-right: 20upx;
  margin-top: 8upx;
  font-size: 32upx;
  text-align: left;
}
.news_panel .news_content {
  margin-top: 10upx;
  font-size: 30upx;
  text-align: left;
  color: #000;
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
  height: auto;
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
