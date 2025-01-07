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
	watch,
	watchEffect
} from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { storeToRefs } from 'pinia';
import { $store } from '@/stores/$store';
import appLayout from '@/components/AppLayout.vue';
import componentSearchArt from '@/components/art/CpnSearchArt.vue';
import componentLoading from '@/components/art/CpnPageLoading.vue';
import componentList from '@/components/art/CpnList.vue';
import Base from '@/utils/app';

interface IData {
	title: string;
	cates: Array<any>;
	currTab?: number;
	currCate: {
		[x: string]: any;
	};
	loading?: {
		box: HTMLDivElement;
		close: () => void;
	} | null;
	isLoading: boolean;
	isBtnShow?: boolean;
	routeId?: number | string;
	moreDataTips: string;
	scrollListener?: {
		off: () => void;
	} | null;
	isScroll?: boolean;
	btnFlag?: boolean;
	pager: {
		pageIndex?: number;
		pageSize?: number;
	};
}

const tabs = useTemplateRef<HTMLDivElement>('tabs');
const route = useRoute();
const router = useRouter();
const { state } = storeToRefs($store());
const data: IData = reactive({
	title: '健康资讯',
	cates: [],
	currTab: 0,
	currCate: {},
	isLoading: false,
	isBtnShow: false,
	routeId: 0,
	moreDataTips: '暂无资讯',
	scrollListener: null,
	isScroll: false,
	btnFlag: false,
	pager: {
		pageIndex: 1,
		pageSize: 10
	}
});

const scrollToTop = () => {
	let scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

	if (scrollTop > window.screen.height) {
		data.btnFlag = true;
	} 
	else {
		data.btnFlag = false;
	}
};

const goTop = () => {
	if (data.isScroll) {
		return;
	}

	data.isScroll = true;
	nextTick(() => {
		let timer = function () {
			let osTop = document.documentElement.scrollTop || document.body.scrollTop;
			let ispeed = Math.floor(-osTop / 5);
			document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;

			if (osTop === 0) {
				data.isScroll = false;
				cancelAnimationFrame(step);
				return;
			}
			step = requestAnimationFrame(timer);
		};

		let step = requestAnimationFrame(timer);
	});
};

const changeRoute = (cateId: number) => {
	router.push({ name: 'Articles', params: { id: cateId } }).catch(() => {});
};

const getIndexData = (cateId: number, callback: Function) => {
	let num: number = 1;

	Base.getTk()
		.then(({ key, sign }) => {
			Base.ajax({
				url: `${Base.api.art.domain}/home/index`,
				data: {
					catid: isNaN(cateId) ? 9 : cateId,
					token: key,
					sign: sign,
					_random_: '',
					page: num,
					size: data.pager.pageSize
				},
				success: callback,
				complete: function () {
					data.isLoading = false;
					data.isScroll = false;
				},
				error: function () {}
			});
		})
		.catch((error) => {
			throw error;
		});
};

const getData = () => {
	if (data.isLoading) {
		return;
	}

	if (!data.currCate) {
		return;
	}

	if (data.currCate.totalCount <= data.currCate.pageSize) {
		return;
	}

	data.isLoading = true;

	const success = function (res: any) {
		if (!res.Bool) {
			Base.toast({ msg: res.Msg });
			return false;
		}

		if (!data.currCate) {
			return false;
		}
		if (data.currCate.articles.length + res.Data.DataList.length <= data.currCate.totalCount) {
			data.currCate.articles = data.currCate.articles.concat(res.Data.DataList);
		}

		if (res.Data.DataList.length === data.currCate.pageSize) {
			data.currCate.pageIndex++;
		}
	};

	Base.getTk()
		.then(({ key, sign }) => {
			Base.ajax({
				url: `${Base.api.art.domain}/article/list`,
				data: {
					catid: data.currCate.Id,
					token: key,
					sign: sign,
					_random_: '',
					page: data.currCate.pageIndex + 1,
					size: data.pager.pageSize
				},
				success: success,
				complete: function () {
					data.isLoading = false;
				},
				error: function () {}
			});
		})
		.catch((error) => {
			throw error;
		});
};

const getTabIndexById = (id: number) => {
	if (!data.cates?.length) {
		return 0;
	}

	for (let i = 0, len = data.cates.length; i < len; i++) {
		if (id === data.cates[i].Id) {
			return i;
		}
	}

	return 0;
};

const fillTabData = (index: number, res: any) => {
	if (!data.cates[index].articles?.length) {
		data.cates[index].articles = res.Data.ArticleList.DataList;
	}

	data.cates[index].totalCount = res.Data.ArticleList.TotalCount;
	data.currCate = data.cates[index];
};

const initData = (cateId: number, isNativeBack: boolean | number) => {
	data.isScroll = true;
	data.isLoading = true;

	const success = function (res: any) {
		if (!res.Bool) {
			Base.wrong({ msg: res.Msg });
			return;
		}

		let index = 0;

		if (!data.cates?.length && res.Data.CategoryList?.length) {
			data.cates = [...res.Data.CategoryList];

			data.cates.forEach((m, i, arr) => {
				m.pageIndex = data.pager.pageIndex;
				m.pageSize = data.pager.pageSize;
				m.moreDataTips = '';

				if (m.Id === cateId) {
					m.totalCount = res.Data.ArticleList.TotalCount;
				}
			});
		}

		index = getTabIndexById(cateId) || 0;
		data.currTab = index;
		fillTabData(index, res);
	};

	!isNativeBack && changeRoute(cateId || 0);
	getIndexData(cateId, success);
};

const onTab = (index: number, cateId: number) => {
	data.currTab = index;
	changeRoute(cateId);

	if (data.cates[index].articles?.length) {
		data.currCate = data.cates[index];
		return;
	}
};

const noMoreData = () => {
	if (!data.currCate) {
		return true;
	}

	if (data.currCate.pageIndex === 1 && !data.currCate.articles?.length) {
		data.currCate.moreDataTips = '';
		data.moreDataTips = data.currCate.moreDataTips;
		return true;
	}

	if (data.currCate.totalCount === data.currCate.articles?.length) {
		data.currCate.moreDataTips = '没有更多资讯了';
		data.moreDataTips = data.currCate.moreDataTips;
		return true;
	}
};

document.title = data.title;
data.routeId = route.params.id as string;

initData(parseInt(data.routeId as string), false);

data.scrollListener = Base.whenScrollBottom(function () {
	if (data.isScroll) {
		return;
	}

	data.currCate && getData();
});

onMounted(() => {
	setTimeout(() => {
		Base.initShare({
			title: '中荷人寿健康资讯',
			desc: '中荷人寿健康资讯',
			link: Base.getShareLink(route.path)
		});
	}, 300);
	
	window.addEventListener('scroll', Base.throttle(scrollToTop, 300));
});

onUnmounted(() => {
	data.scrollListener && data.scrollListener.off();
	window.removeEventListener('scroll', scrollToTop);
});

onBeforeRouteUpdate(async (to, from, next) => {
	if (typeof to.params.id === 'string') {
		initData(parseInt(to.params.id as string), true);
	}

	next();
});

</script>

<template>
	<app-layout>
		<div class="home-set">
			<div class="set-tabs">
				<div class="tabs" ref="tabs">
					<template v-for="(cate, i) in data.cates" :key="cate.Id">
						<a @click="onTab(i, cate.Id)" :class="{ on: data.currTab === i }">
							{{ cate.Name }}
						</a>
					</template>
				</div>
			</div>

			<component-search-art></component-search-art>

			<!-- 文章列表 -->
			<div class="set-cont-wrap">
				<template v-for="(cate, i) in data.cates" :key="cate.Id">
					<div v-show="data.currTab === i" class="cont-list js-tab-item">
						<component-list :articles="cate.articles"></component-list>
					</div>
				</template>
			</div>

			<div class="bottom-logo">
				<!-- <img src="@/assets/images/logo_zhrs.png" alt="底部logo" /> -->

				<p class="bottom-logo-name">中荷人寿保险有限公司</p>
				<p class="bottom-logo-msg">中荷人寿自营网络平台<em>信息披露</em>，可点选中荷人寿查看</p>
			</div>

			<component-loading
				:isLoading="data.isLoading"
				:notMore="noMoreData()"
				:tips="data.moreDataTips"
			></component-loading>

			<transition name="fade">
				<div @click="goTop" v-show="data.btnFlag" class="btn-gotop">返回顶部</div>
			</transition>
		</div>
	</app-layout>
</template>
