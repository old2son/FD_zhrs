import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { IState } from '@/stores/interface/state';

export const $store = defineStore('$store', () => {
	const state: IState = reactive({
		referrer: document.referrer,
		keyword: '',
		sign: '',
		token: '',
		appID: '',
		// txVideoSign: '',
		licenseUrl: ''
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
