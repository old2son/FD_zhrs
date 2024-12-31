import { createRouter, createWebHashHistory } from 'vue-router';

const ArtHome = () => import('@/components/art/Home.vue');
const ArtSearch = () => import('@/components/art/Search.vue');
const Detail = () => import('@/components/art/Detail.vue');
const modules = import.meta.glob('@/views/**/*.vue');

const routes = [
	{
		path: '/',
		name: 'Home',
		redirect: '/articles/'
	},
	{
		path: '/articles/:id',
		name: 'Articles',
		component: ArtHome
	},
	{
		path: '/articles/0',
		redirect: '/Articles/9',
		strict: false,
		sensitive: false
	},
	{
		path: '/articles/',
		redirect: '/Articles/9',
		strict: false,
		sensitive: false
	},
	{
		path: '/art/search/:keyword',
		name: 'ArtSearch',
		component: ArtSearch
	},
	{
		path: '/article/:id',
		name: 'Article',
		component: Detail
	}
];

const modulesRoute = Object.keys(modules).map((key) => {
	const name = key.replace(/.*\/(.*).vue$/, '$1');
	const path = name === 'Home' ? '/' : `/${name.toLowerCase()}`;

	return {
		path,
		name,
		component: modules[key]
	};
});

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...routes, ...modulesRoute],
	strict: false,
	sensitive: false,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			let position: any = {};

			if (to.hash) {
				position.selector = to.hash;
			}

			if (to.matched.some((m) => m.meta.scrollToTop)) {
				position.x = 0;
				position.y = 0;
			}

			return position;
		}
	}
});

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		next({ name: 'Home' });
	} 
	else {
		next();
	}
});

export default router;
