<template>
	<div class='body h100p relative'>
		<div class='pos tc'>
			<h2 class='title'>404</h2>
			<p class='tip'>
				找不到资源
			</p>
			<button type="button" class="btn btn-outline-purple" @click='goToBack()'>
				<i class='fa fa-arrow-circle-o-left'></i><span>返回</span>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'sys404',
		methods: {
			goToBack() {
				this.goBack();
			}
		}
	}
</script>

<style scoped>
	.body{background-color: #f0f3f4;}
	.pos{
		position:absolute;
		top:50%;
		left:50%;
		transform: translate(-50%, -80%);
	}
	.title{
		font-size: 170px;
		color: #fa0;
		text-shadow:0 1px 0 #fc0, 0 2px 0 #fc0, 0 5px 10px #ffffff, 0 10px 20px #fc0;
	}
	.tip{font-size:30px;}
</style>
