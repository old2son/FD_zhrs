<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
	var _hmt: any = _hmt || [];
	(function () {
		var hm = document.createElement('script');
		hm.src = 'https://hm.baidu.com/hm.js?c1ecb06e51faa6d930607cc0e3861401';
		var s: any = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(hm, s);
	})();
});
</script>

<template>
	<router-view></router-view>
</template>

<style scoped></style>
