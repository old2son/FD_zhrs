<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { $store } from '@/stores/$store';
import { storeToRefs } from 'pinia';

const { state } = storeToRefs($store());
let isShowBack = ref(true);

const route = useRoute();
const router = useRouter();

const goBack = () => {
    router.back();
}

if (!state.value.referrer) {
    if (route.name === 'Article') {
        isShowBack.value = false;
    }
}
</script>

<template>
	<div class="wrapper">
        <div class="main">
            <slot></slot>
        </div>
	</div>
</template>


