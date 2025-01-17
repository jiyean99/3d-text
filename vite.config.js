/** @type {import('vite').UserConfig} */
export default {
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInclude: ['src/asset/fonts/**/*.json'],
  },
  base: '/3d-text',
}
