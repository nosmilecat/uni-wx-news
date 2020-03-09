<template>
  <div class="view">
	<div class="canvas-box">
		<canvas canvas-id="hbCanvas"></canvas>
	</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
		userInfo:{},
	}
  },  
  methods:{
	  createHb() {
		  const ctx = uni.createCanvasContext('hbCanvas');
		  uni.chooseImage({
		    success: (res)=> {
		      ctx.drawImage(res.tempFilePaths[0], 0, 0, uni.getSystemInfoSync().windowWidth, 300);
			  ctx.setFontSize(20);
			  ctx.fillText('heheheheheheheheheheh', 20, 330);
		      ctx.draw();
			  ctx.setStrokeStyle('#eaeaea')
			  ctx.moveTo(0, 350);
			  ctx.lineTo(uni.getSystemInfoSync().windowWidth, 350);
			  ctx.stroke()
			  ctx.draw(true);
			  uni.downloadFile({  
				  url: this.userInfo.avatarUrl,  
				  success: (res)=> {  
					  if (res.statusCode === 200) {
						  console.log(res)
						  ctx.arc(35, 385, 15, 0, Math.PI * 2);
						  ctx.setFillStyle('#fff');
						  ctx.fill();
						  ctx.clip();
						  ctx.drawImage(res.tempFilePath, 20, 370, 30, 30 );
						  ctx.draw(true);
						  // 生成图片
						  uni.canvasToTempFilePath({
						    canvasId: 'hbCanvas',
						    success: (res)=> {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: ()=> {
										uni.showToast({
											title: '已保存至相册',
											duration: 2000
										})
									},
									fail: ()=> {
										uni.showToast({
											title: '保存失败，请重试',
											duration: 2000
										})
									}
								});
						    },
							fail: ()=> {
								uni.showToast({
									title: '海报生成失败，请重试',
									duration: 2000
								})
							}
						  })
						 
					  }
				  },
				  fail: (err)=> {
					  console.log(err)
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
		position: relative;
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
</style>
