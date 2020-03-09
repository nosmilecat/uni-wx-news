<template>
  <div class="view">
	<scroll-view class="nav" :scroll-x="true">
		<view
			v-for="(item,index) in newsTypeList" 
			:key="index" class="nav-item" 
			:class="{'active': newsTypeVal==item.newsTypeVal}" 
			:data-current="item.newsTypeVal"
			@tap="changeTitle"
		>
			{{item.newsTypeName}}
		</view>
	</scroll-view>
	<scroll-view
		class="scroll-container"
		:scroll-y="true"
		@scrolltolower="tolower"
	>
		<div class="news-box" v-for="(item, index) in newsList" :key="index">
			<div class="date"><span class=".icon"></span>{{item.newsDate}}</div>
			<!-- <div class="time"><span class=".icon"></span>{{item.newsDate.split(' ')[1]}}</div> -->
			<div class="main">
				<div class="steps-border">
					<div class="title">{{item.newsTitle}}</div>
					<div class="content">{{item.newsContent}}</div>
					<div class="share">
						<button class="box" open-type="share" :data-title="item.newsTitle"><span class="icon-weixin iconfont"></span>好友</button>
						<button class="box" @tap="createHb(item.newsTitle)"><span class="icon-shengchenghaibao iconfont"></span>海报</button>
					</div>
				</div>
			</div>
		</div>
		<div class="load_more">
		  <uni-load-more :iconSize="18" :status="loadmore" :showIcon="true" :contentText="contentText" />
		</div>
	</scroll-view>
  </div>
</template>

<script>
import uniLoadMore from "@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue"
export default {
  data () {
    return {
		newsList:[],
		newsTypeList:[],
		newsTypeVal: 0,
		current: 1,
		contentText:{
			contentdown: "上拉显示更多",
			contentrefresh: "正在加载...",
			contentnomore: "没有更多数据了"
		},
		loadmore: 'loading',
		stepsOptions:{}
	}
  },

  components: {
     uniLoadMore,
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
  methods:{
	  async getNewsTypeList() {
		let result = await  this.$axios.post('/news/getNewsTypeList');
		this.newsTypeList = result;
		this.newsTypeVal = result[0].newsTypeVal;
		this.getNewsList();
	  },
	  async getNewsList() {
		let newsTypeId = this.newsTypeVal;
		let current = this.current;
		let data = {
			newsTypeId,
			size: 10,
			current
		};
		let result = await  this.$axios.post('/news/getNewsListByType', data);
		this.newsList = this.newsList.concat(result.rows);
		if(result.rows.length < 10) {
			this.loadmore = 'noMore';
		}
	  },
	  changeTitle (event) {
	    let index = event.target.dataset.current// 当前点击标题的index
	    this.newsTypeVal = index;
		this.current = 1;
		this.loadmore = 'loading';
		this.newsList = [];
		this.getNewsList();
	  },
	  tolower () {
	  	if(this.loadmore === 'noMore') {
	  		return
	  	}
	    this.current = this.current + 1;
	    this.getNewsList();
	  },
	  createHb(title) {
		  
	  }
  },

  created () {
    this.getNewsTypeList();
  }
}
</script>

<style scoped>
	.view {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		box-sizing: border-box;
	}
	.nav {
	  width: 100%;
	  padding: 20upx 10upx;
	  box-sizing: border-box;
	  background: #fff;
	  white-space: nowrap;
	  font-size: 24upx;
	  position: fixed;
	  top: 0;
	  left: 0;
	  z-index: 99;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	.nav-item {
	  margin: 0 6upx;
	  padding: 10upx 40upx;
	  display: inline-block;
	  text-align: center;
	  border-radius: 20upx;
	  background-color: #E5E5E5;
	}
	.nav-item.active {
	  background-color: #ff5133;
	  color: #fff;
	}
	.scroll-container {
	  flex: 1;
	  margin-top: 100upx;
	}
	.news-box {
		padding: 0 30upx;
	}
	.news-box .date {
		font-size: 34upx;
		font-weight: 700;
		padding: 0 15upx;
		position: relative;
		color: #1a1a1a;
	}
	.news-box .date .icon {
		position: absolute;
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background: #ce0000;
		top: 18upx;
		left: -2upx;
		z-index: 1;
	}
	.news-box .time {
		font-size: 24upx;
		padding: 0 30upx;
		position: relative;
		color: #ce0000;
	}
	.news-box .time .icon {
		position: absolute;
		width: 8upx;
		height: 8upx;
		border-radius: 50%;
		border: 1px solid #ce0000;
		top: 12upx;
		left: -2upx;
		z-index: 1;
	}
	.news-box .main {
		/* padding: 0 15upx; */
	}
	.news-box .main .steps-border {
		padding: 15upx;
		border-left: 1px solid #e5e5e5;
	}
	.news-box .main .title {
		font-size: 32upx;
		line-height: 46upx;
	}
	.news-box .main .content {
		font-size: 28upx;
		line-height: 42upx;
		margin-top: 10upx;
		color: rgba(0,0,0,.6);
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
	.news-box .share {
	  text-align: right;
	  padding: 0 10upx;
	  font-size: 30upx;
	  margin-top: 20upx;
	  color: rgba(0,0,0,.6);
	}
	.news-box .share button {
	  display: inline-block;
	  background-color: #fff;
	  line-height: 1;
	  color: rgba(0,0,0,.6);
	}
	.news-box .share button::after {
	  border: none;
	}
	.news-box .share .box {
		font-size: 26upx;
	}
	.news-box .share .box .iconfont {
		margin-right: 10upx;
	}
</style>
