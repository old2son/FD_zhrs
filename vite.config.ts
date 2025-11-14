 /**
  * 现在 transformIndexHtml，modifyEntryFile，writeBundle 的内容只为 demo。
  * 由于 vite 打包后的文件会有不同位置的引用和判断，注意如果修改打包文件如：添加随机参数等，则会出现多次调用同个包等问题。
  * 请根据实际情况修改钩子函数调用。
  */
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import { resolve } from 'path'; // 路径
import { JSDOM } from 'jsdom';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd(), 'VITE_');

	return {
		base: '/', // https://zhrs-health.familydoctor.cn/
		resolve: {
			alias: {
				'@': resolve('src')
			}
		},
		publicDir: resolve('public'),
		mode: mode,
		server: {
			host: '0.0.0.0',
			port: parseInt(env.VITE_PORT, 10) as number,
			cors: true, // 默认启用
			proxy: mode === 'development'
				? {
						[`/${env.VITE_API_URL}`]: {
							target: env.VITE_API_URL_TARGET,
							changeOrigin: true,
							rewrite: (path) => path.replace(new RegExp(`^/${env.VITE_API_URL}`), '')
						}
				  }
				: undefined
		},
		plugins: [
			vue(),
			{
				// html 模板修改
				name: 'config-index-html',
				transformIndexHtml(html, tags) { 
					if (mode === 'development') {
						return;
					}
					
					let txt = html;

					const dom = new JSDOM(txt);
					const doc = dom.window.document;

					const links = doc.querySelectorAll('link');
					const scripts = doc.querySelectorAll('script');
					const allTags = [...Array.from(links), ...Array.from(scripts)];

					links.forEach((link: HTMLLinkElement) => link.remove());
					scripts.forEach((script: HTMLScriptElement) => script.remove());

					const tagArr: any[] = [];

					allTags.forEach((item: HTMLLinkElement | HTMLScriptElement) => {
						const obj: any = {};

						if (item.tagName.toLowerCase() === 'link') {
							obj.link = true;
						}
						else if (item.tagName.toLowerCase() === 'script') {
							obj.script = true;
						}

						Array.from(item.attributes).forEach((attr) => {
							const value = attr.value;
							obj[attr.name] = value;
						});
						tagArr.push(obj);
					})

					const newScript = doc.createElement('script');
					newScript.innerHTML = `
						const head = document.head;
						const tagArr = ${JSON.stringify(tagArr)}

						for (const attr of tagArr) {
							let tag = '';
							for (const [key, value] of Object.entries(attr)) {
								if (key === 'link') {
									tag = document.createElement('link');
									continue;
								}
								else if (key === 'script') {
									tag = document.createElement('script');
									continue;
								}

								let updateValue = value

								if (key === 'src') {
									updateValue += '?v=' + new Date().getTime();
								}
								tag.setAttribute(key, updateValue);
							}
							head.appendChild(tag);
						}
					`;

					doc.body.appendChild(newScript);
					txt = doc.documentElement.outerHTML;
					txt = txt.replace(/\n\s*\n/g, '\n').replace(/^\s+|\s+$/gm, '');
					return txt;
				}
			},
			{
				// 修改入口文件
				name: 'modify-entry-file',
				generateBundle(options, bundle) {
					for (const fileName in bundle) {
						const chunk = bundle[fileName];

						if (chunk.type === 'chunk' && fileName.includes('entry-main')) {
							chunk.code = chunk.code.replace(/endsWith\("\.css"\)/, 'includes(".css")');
						}
					}
				}
			},
			{
				// 修改输出后的文件
				name: 'modify-output-file',
				writeBundle(options, bundle) {
					const outputDir = options.dir;
					const strFnRandomParam = `function randomParam() { return Math.random().toString(36).substring(2, 11); }`;

					const addRandomParam = (match: string) => {
						return `${match.slice(0, -1)}?v=" + randomParam()`;
					};

					for (const fileName in bundle) {
						const chunk = bundle[fileName];

						if (chunk.type === 'chunk' && fileName.includes('entry-main')) {
							const filePath = resolve(outputDir, fileName);
							let updatedStr = chunk.code.replace(/"static\/js\/[^"]+\.js"/g, addRandomParam);
							updatedStr = updatedStr.replace(/"static\/css\/[^"]+\.css"/g, addRandomParam);
							updatedStr = strFnRandomParam + updatedStr;
							fs.writeFileSync(filePath, updatedStr);
						}
					}
				}
			}
		],
		build: {
			outDir: 'dist',
			assetsDir: 'assets',
			assetsInlineLimit: 4096, // 默认 4096
			sourcemap: true,
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'index.html')
				},
				output: {
					entryFileNames: `static/js/entry-[name].js`,
					chunkFileNames: `static/js/chunk-[name]-[hash].js`,
					assetFileNames: (assetInfo) => {
						let name = assetInfo.names[0];
						let info = name.split('.');
						let extType = info[info.length - 1];

						if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(name)) {
							extType = 'media';
						} else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name)) {
							extType = 'img';
						} else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(name)) {
							extType = 'font';
						}

						return `static/${extType}/[name][extname]`;
					}
				}
			},
			minify: 'esbuild'
		}
	};
});


