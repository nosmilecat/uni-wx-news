<template>
	<div class="view">
		<swiper class="swiper" :vertical="true" :indicator-dots="false" :autoplay="false">
			<swiper-item>
				<scroll-view :scroll-y="true" class="swiper-item">
					<div class="title">
						{{newsDetail.newsTitle}}
					</div>
					<div class="newsSource">
						<div class="newsSourceName">
							<span class="img"><image :src="newsDetail.newsSourceIcon"></image></span>
							<span>{{newsDetail.newsSourceName}}</span>
							<span class="date">{{newsDetail.newsDate}}</span>
						</div>
						<div class="focus">+ 关注</div>
					</div>
					<rich-text :nodes="newsDetail.newsContent"></rich-text>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">B</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">C</view>
			</swiper-item>
		</swiper>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				newsDetail: {},
			}
		},
		methods:{
			async getNewsDetail() {
				let id = this.id;
				let result = await this.$axios.get('/news/getNewsInfo', {
					params:{id}
				})
				this.newsDetail = result;
			},
		},
		onLoad(params) {
			this.id = params.id;
			this.getNewsDetail();
		},
		mounted() {
		}
	}
</script>

<style>
	.view {
		width: 100%;
		height: 100%;
	}
	.swiper {
		width: 100%;
		height: 100%;
	}
	.swiper .swiper-item {
		width: 100%;
		height: 100%;
	}
	.swiper-item .title {
		font-size: 40upx;
		font-weight: 700;
		padding: 20upx;
	}
	.swiper-item .newsSource {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		padding: 0 20upx;
		margin: 10upx 0 20upx;
	}
	.swiper-item .newsSourceName {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.swiper-item .focus {
		font-size: 24upx;
		background-color: #007AFF;
		color: #fff;
		padding: 4upx 26upx;
		border-radius: 25upx;
	}
	.swiper-item .newsSource .img {
		display: inline-block;
		border-radius: 50%;
		width: 50upx;
		height: 50upx;
		overflow: hidden;
		margin-right: 15upx;
	}
	.swiper-item .newsSource .img image {
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}
	.swiper-item .newsSource .date {
		color: rgba(0,0,0,.6);
		font-size: 24upx;
		margin-left: 15upx;
	}
</style>
