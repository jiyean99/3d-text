/** @type {import('vite').UserConfig} */
export default {
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInclude: ['**/*.json'], // .json 파일 포함
  },
  base: '/3d-text',
}
