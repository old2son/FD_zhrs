import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { IState } from '@/stores/interface/state';

export const $store = defineStore('$store', () => {
	const state: IState = reactive({
		referrer: document.referrer,
		keyword: '',
		sign: '',
		token: '83UIRKN890JLFLLFF09LF65JFFLD82UFJB',
		appID: '1252162195',
		// txVideoSign: 'aca51a4adbb8d9ceefc2436e3ece5eea',
		licenseUrl: 'https://license.vod2.myqcloud.com/license/v2/1252162195_1/v_cube.license'
	});

	const setReferrer = (referrer: string) => {
		state.referrer = referrer;
	};

	const setKeyword = (keyword: string) => {
		state.keyword = keyword;
	};

	const setSign = (sign: string) => {
		state.sign = sign;
	};

	const actions = {
		setReferrer,
		setKeyword,
		setSign
	};

	return {
		state,
		...actions
	};
});
