const path = require('path')
const fsExtra = require('fs-extra')
const fs = require('fs')
const { defineConfig, build } = require('vite')
const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')


const entryDir = path.resolve(__dirname, '../components')
const outputDir = path.resolve(__dirname, '../../lib')


const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()]
})

const rollupOptions = {
  external: ['vue', 'vue-router'],
  output: {
    globals: {
      vue: 'Vue'
    }
  }
}

//全量构建
const buildAll = async () => {
  await build(defineConfig({
    ...baseConfig,
    build: {
      rollupOptions,
      lib: {
        entry: path.resolve(entryDir, 'index.ts'),
        name: 'index',
        fileName: 'index',
        formats: ['es', 'umd']
      },
      outDir: outputDir
    }
  }))
}


const buildSingle = async (name) => {
  await build(defineConfig({
    ...baseConfig,
    build: {
      rollupOptions,
      lib: {
        entry: path.resolve(entryDir, name),
        name: 'index',
        fileName: 'index',
        formats: ['es', 'umd']
      },
      outDir: path.resolve(outputDir, name)
    }
  }))
}

// 生成组件的 package.json 文件
const createPackageJson = (name) => {
  const fileStr = `{
  "name": "${name}",
  "version": "0.0.0",
  "main": "index.umd.js",
  "module": "index.es.js",
  "style": "style.css"
}`

  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/package.json`),
    fileStr,
    'utf-8'
  )
}


const declareFileStr = `
import { App } from 'vue';
declare const _default: {
  install(app: App): void
}
export default _default`;


const createDeclare = (name) => {
  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/index.d.ts`),
    declareFileStr,
    'utf-8'
  )
}




const buildLib = async () => {
  await buildAll()
  // 获取组件名称组成的数组
  const components = fs.readdirSync(entryDir).filter(name => {
    const componentDir = path.resolve(entryDir, name)
    const isDir = fs.lstatSync(componentDir).isDirectory()
    return isDir && fs.readdirSync(componentDir).includes('index.ts')
  })

  fsExtra.outputFile(
    path.resolve(outputDir, `index.d.ts`),
    declareFileStr,
    'utf-8'
  )

  

  // 循环一个一个组件构建
  for (const name of components) {
    // 构建单组件
    await buildSingle(name)

    // 生成组件的 package.json 文件
    createPackageJson(name)

    // 生成组件的 index.d.ts
    createDeclare(name)
  }
}

buildLib()
