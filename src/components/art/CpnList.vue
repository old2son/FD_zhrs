<script setup lang="ts">
import { useAttrs } from 'vue';
import Base from '@/utils/app';

const attrs = useAttrs();
const props = withDefaults(
	defineProps<{
		articles?: Array<any>;
	}>(),
	{
		articles: [] as any
	}
);

const formatTime = (timestamp: number) => {
	return Base.formatTime(timestamp * 1000);
};

</script>

<template>
	<router-link v-for="(art, artIndex) in props.articles" :key="art.Id" :to="'/Article/' + art.Id">
		<dl>
			<dt v-if="!art.PicUrl && !art.VideoPicUrl"></dt>
			<dt v-else-if="art.Type === 3" :style="'background:url(' + art.VideoPicUrl + ') center no-repeat;'"></dt>
			<dt v-else :style="'background:url(' + art.PicUrl + ') center no-repeat;'"></dt>

			<dd>
				<b>{{ art.Title }}</b>
				<i class="icon-clock">{{ formatTime(art.PushPublishDate || art.PublishDate) }}</i>
				<i v-if="art.Type === 0" class="type-art">文章</i>
				<i v-else-if="art.Type === 3" class="type-video">视频</i>
				<i v-else-if="art.Type === 4" class="type-art" style="width: 80px">每日医说</i>
			</dd>
		</dl>

		<slot name="custom-art"></slot>
	</router-link>
</template>
