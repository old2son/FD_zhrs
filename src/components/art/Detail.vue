<script setup lang="ts">
import {
	ref,
	reactive,
	useTemplateRef,
	onMounted,
	onUnmounted,
	nextTick,
	computed,
	provide,
	toRefs,
	watchEffect
} from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { storeToRefs } from 'pinia';
import { $store } from '@/stores/$store';
import appLayout from '@/components/AppLayout.vue';
import componentSearchArt from '@/components/art/CpnSearchArt.vue';
import Base from '@/utils/app';
// import TCPlayer from 'tcplayer.js';
// import 'tcplayer.js/dist/tcplayer.min.css';

interface IData {
	title: string;
	articleId: number;
	article: IArticle;
	articles: Array<any>;
	tags: Array<any>;
	zoomLevel: number;
	videoDuration: number;
}

interface IArticle {
	Content: string;
	Copyright: string;
	Id: string | number;
	PicUrl: string;
	PublishDate: number | null;
	Publisher: string;
	Summary: string;
	DoctorName: string;
	DoctorImage: string;
	ClinicTitle: string;
	TeachTitle: string;
	DepartmentName: string;
	HospitalName: string;
	Title: string;
	Type: number | null;
	VideoPicUrl?: string | null;
	VideoUrl?: string | null;
	ViewCount: number;
}

const route = useRoute();
const router = useRouter();
const { state } = storeToRefs($store());
const data: IData = reactive({
	title: '健康资讯',
	articleId: 0,
	article: {
		Content: '',
		Copyright: '',
		Id: '',
		PicUrl: '',
		PublishDate: null,
		Publisher: '',
		Summary: '',
		DoctorName: '',
		DoctorImage: '',
		ClinicTitle: '',
		TeachTitle: '',
		DepartmentName: '',
		HospitalName: '',
		Title: '',
		Type: null,
		VideoPicUrl: null,
		VideoUrl: null,
		ViewCount: 0
	},
	articles: [],
	tags: [],
	zoomLevel: 0,
	videoDuration: 0
});
const video = useTemplateRef<HTMLVideoElement>('video');
const summary = useTemplateRef<HTMLDivElement>('summary');
const Player = ref(null) as any;

const isExpanded = ref(false);
const isShowToggleButton = ref(false);

const formatTime = (timestamp: number) => {
	return Base.formatTime(timestamp * 1000);
};

const getUserFontSize = () => {
	const fontSize = localStorage.getItem('userFontSize');

	if (fontSize) {
		data.zoomLevel = parseInt(fontSize) || 0;
	}
};

const setUserFontSize = () => {
	localStorage.setItem('userFontSize', data.zoomLevel.toString());
};

const loadData = () => {
	Base.getTk()
		.then(({ key, sign }) => {
			Base.ajax({
				url: `${Base.api.art.domain}/article/get`,
				data: {
					id: data.articleId,
					token: key,
					sign: sign,
					_random_: ''
				},
				success: function (res: any) {
					if (!res.Data) {
						Base.wrong({ msg: res.Msg });
						return;
					}

					let desc: string = '';
					let imgUrl: string | null | undefined = '';

					if (res.Data.Article.Type === 0) {
						Player.value = null;
						imgUrl = res.Data.Article.PicUrl || '';
					} else if (res.Data.Article.Type === 3) {
						desc = res.Data.Article.Title;
						imgUrl = res.Data.Article.VideoPicUrl || res.Data.Article.DoctorImage;
					}

					desc = res.Data.Article.Summary;
					desc = desc.substring(0, 60);
					data.article = res.Data.Article;
					data.articles = res.Data.ArticleRelate;
					data.tags = res.Data.ArticleLabel;

					nextTick(() => {
						Base.initShare({
							title: data.article.Title,
							desc: desc,
							imgUrl: imgUrl
						});

						if (data.article.Type !== 3 || !data.article.VideoUrl) {
							return;
						}

						if (Player.value) {
							Player.value.loadVideoByID({
								fileID: data.article.VideoUrl,
								appID: state.value.appID,
								licenseUrl: state.value.licenseUrl
							});
						} else if (video.value) {
							video.value.id = 'txvideo' + (1000 * Math.random()).toFixed(0);
							Player.value = TCPlayer(video.value.id, {
								fileID: data.article.VideoUrl,
								appID: state.value.appID,
								licenseUrl: state.value.licenseUrl
							});
						}

						Player.value.ready(() => {
							Player.value.on('loadstart', function () {
								Player.value.poster(data.article.VideoPicUrl || '');
							});
						});
					});
				},
				complete: function () {},
				error: function () {}
			});
		})
		.catch((error) => {
			throw error;
		});
};

const zoom = () => {
	if (data.zoomLevel >= 2) {
		data.zoomLevel = 0;
	} else {
		data.zoomLevel = data.zoomLevel + 1;
	}

	setUserFontSize();
};

const checkContentHeight = () => {
	if (summary.value) {
		const lineHeight = parseFloat(window.getComputedStyle(summary.value).lineHeight);
		const maxHeight = lineHeight * 2;

		if (summary.value.scrollHeight > maxHeight) {
			isShowToggleButton.value = true;
		} else {
			isShowToggleButton.value = false;
		}
	}
};

const toggleContent = () => {
	isExpanded.value = !isExpanded.value;
};

const guid = () => {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const setSeo = () => {
	Base.getTk()
		.then(({ key, sign }) => {
			Base.ajax({
				url: `${Base.api.art.domain}/article/AddUserViewLog`,
				data: {
					id: data.articleId,
					token: key,
					sign: sign,
					guidCode: guid(),
					pixelwidth: window.screen.width,
					pixelheight: window.screen.height
				},
				success: function (res: any) {}
			});
		})
		.catch((error) => {
			throw error;
		});
};

document.title = data.title;
data.articleId = parseInt(route.params.id as string) || 0;
loadData();
setSeo();

onMounted(async () => {
	getUserFontSize();
});

onUnmounted(() => {
	if (Player.value) {
		Player.value = null;
	}
});

onBeforeRouteUpdate(async (to, from, next) => {
	data.articleId = parseInt(to.params.id as string) || 0;
	loadData();
	setSeo();

	nextTick(() => {
		Base.scrollToTop();
	});

	next();
});

watchEffect(async () => {
	if (data.article.Summary) {
		await nextTick();
		isExpanded.value = false;
		checkContentHeight();
	}
});
</script>

<template>
	<app-layout>
		<div class="article-wrap">
			<div class="article-cont">
				<h1>{{ data.article.Title }}</h1>
				<div class="info">
					<i class="icon-clock">{{ formatTime(data.article.PublishDate as number) }}</i>

					<a
						@click="zoom()"
						class="circle-upcase on"
						:class="{ 'circle-upcase-blue': data.article.Type === 3 }"
					>
						Aa
					</a>
				</div>

				<div class="detail" :class="'zoom-' + data.zoomLevel">
					<template v-if="data.article.Type === 3">
						<div class="txvideo-wrap" v-if="data.article.VideoUrl">
							<video ref="video" class="txvideo" id="txvideo"></video>
						</div>

						<dl class="dr-info">
							<dt v-if="!data.article.DoctorImage" style="background-color: #f3f4f6"></dt>
							<dt
								v-else
								:style="'background:url(' + data.article.DoctorImage + ') center no-repeat;'"
							></dt>
							<dd>
								<h3>
									{{ data.article.DoctorName }}
									<span>
										{{ data.article.ClinicTitle }}
										{{ data.article.TeachTitle }}
									</span>
								</h3>

								<div class="dr-info-other">
									<b>{{ data.article.DepartmentName }}</b>
									<b>{{ data.article.HospitalName }}</b>
								</div>
							</dd>
						</dl>

						<div class="cont-wrapper" :style="{ paddingBottom: isShowToggleButton ? '30px' : '0' }">
							<div
								class="dr-summary"
								:class="{ expanded: isExpanded }"
								ref="summary"
								v-html="data.article.Summary"
							></div>

							<div v-if="isShowToggleButton" class="btn-toggle-wrap" :class="{ top: isExpanded }">
								<button @click="toggleContent">
									{{ isExpanded ? '收起全文' : '展开阅读全文' }}
									<i class="icon-arrow"></i>
								</button>
							</div>
						</div>
					</template>
					<template v-else>
						<div v-html="data.article.Content"></div>
					</template>
				</div>

				<p v-if="data.article.Copyright" class="cont-mark">{{ data.article.Copyright }}</p>
			</div>

			<component-search-art :articleType="data.article.Type || 0"></component-search-art>

			<div class="home-set">
				<div class="cont-list">
					<b class="list-title" :class="{ 'list-title-blue': data.article.Type === 3 }">推荐阅读</b>
					<router-link v-for="m in data.articles" :key="m.Id" :to="{ name: 'Article', params: { id: m.Id } }">
						<dl>
							<dt v-if="!m.PicUrl && !m.VideoPicUrl"></dt>
							<dt
								v-else-if="m.Type === 3"
								:style="'background:url(' + m.VideoPicUrl + ') center no-repeat;'"
							></dt>
							<dt v-else :style="'background:url(' + m.PicUrl + ') center no-repeat;'"></dt>

							<dd>
								<b>{{ m.Title }}</b>
								<i class="icon-clock">{{ formatTime(m.PublishDate) }}</i>
								<i v-if="m.Type === 0" class="type-art">文章</i>
								<i v-else-if="m.Type === 3" class="type-video">视频</i>
								<i v-else-if="m.Type === 4" class="type-art" style="width: 80px;">每日医说</i>
							</dd>
						</dl>
					</router-link>
				</div>
			</div>
		</div>
	</app-layout>
</template>

<style scoped lang="scss">
.txvideo-wrap {
	padding-bottom: 8px;

	.txvideo {
		width: 100%;
		height: 100%;
		padding-top: 56.25%;
		margin: 0 auto;
	}
}

.dr-info {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	margin-top: 5px;
	overflow: hidden;

	dt {
		flex-shrink: 0;
		width: 50px;
		height: 50px;
		margin-right: 12px;
		overflow: hidden;
		border-radius: 50%;
		background: url(@/assets/images/icon_user.png) center no-repeat;
		background-size: 100% auto !important;
	}

	dd {
		overflow: hidden;
	}

	h3 {
		color: #0a0d2c;
		font-size: 14px;
		font-weight: 700;

		span {
			color: #333;
			font-size: 12px;
			font-weight: 400;
		}
	}

	&-other {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		b {
			margin-right: 8px;
			color: #b3b3b3;
			font-size: 12px;
			font-weight: 400;
		}
	}
}

.cont-wrapper {
	position: relative;

	.dr-summary {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-top: 8px;
		overflow: hidden;
		word-break: break-word;
		transition: all 0.3s ease;

		&.expanded {
			-webkit-line-clamp: unset;
			line-clamp: 2;
		}
	}

	.btn-toggle-wrap {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 10;
		width: 100%;
		padding: 20px 0 0;
		height: 50px;
		text-align: center;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 45%);

		button {
			position: relative;
			padding-right: 20px;
			border: none;
			outline: none;
			color: #2f8cb8;
			font-size: 14px;
			background: transparent;
		}

		.icon-arrow {
			display: block;
			position: absolute;
			right: 0;
			top: calc(50% + 2px);
			width: 16px;
			height: 16px;
			margin: 0 auto;
			transform: rotate(0deg) translateY(-50%);
			transition: transform 0.15s ease;
			background: url(@/assets/images/icon_show_blue.png) center no-repeat;
			background-size: 100% auto;
		}

		&.top {
			background: transparent;

			.icon-arrow {
				transform: rotate(180deg);
				transform-origin: 9px 3px;
			}
		}
	}
}
</style>
