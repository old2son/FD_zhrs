<script setup lang="ts">
import { ref, reactive, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { $store } from '@/stores/$store';

interface IData {
    autoList: Array<any>;
    keyword: string;
    autoComplete: Function | null
}

const route = useRoute();
const router = useRouter();
const store = $store();
const data: IData = reactive({
    autoList: [],
    keyword: '',
    autoComplete: null
});

const props = withDefaults(defineProps<{
    articleType?: number;
}>(), {
    articleType: 0
});

const search = (keyword: string, e: KeyboardEvent) => {
    data.keyword = keyword || data.keyword;

    if (!data.keyword) {
        return;
    }

    if (router.currentRoute.value.name !== 'ArtSearch') {
        router.push({
            name: 'ArtSearch',
            params: {
                keyword: data.keyword
            }
        });
        return;
    }

    store.setKeyword(data.keyword);
    (<HTMLElement>e.target).blur();
}

</script>

<template>
    <div class="search-wrap">
        <div class="search-bar" :class="{'search-bar-blue': props.articleType === 3}">
            <form action="." method="get">
                <input 
                    type="search" 
                    @keydown.enter.prevent="search('', $event)" 
                    v-model.trim="data.keyword" 
                    :placeholder="'请输入关键词'"
                >
            </form>
        </div>
    </div>
</template>