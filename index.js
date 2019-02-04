const { writeFileSync, readFileSync } = require('fs')
const path = require('path')
const swPrecache = require('sw-precache')
const UglifyJS = require('uglify-es')

const DEFAULT_FILENAME = 'service-worker.js'
const DEFAULT_CACHE_FILE_TYPE = `js,css,png,jpg,gif,svg,ico,eot,ttf,woff,woff2`
const DEFAULT_IGNORE = [
    /\.map$/,
    /service-worker\.js$/,
    /sw\.js$/
]

let distDir = ''

const getServiceWorker = ({ outDir, customOptions = {}, rootDir }) => {
    const options = {
        navigateFallback: '/index.html',
        staticFileGlobs: [
            `dist/*.{${DEFAULT_CACHE_FILE_TYPE}}`,
            `dist/index.html`
        ],
        staticFileGlobsIgnorePatterns: DEFAULT_IGNORE,
        stripPrefix: 'dist/'
    }
    return swPrecache.generate(Object.assign(options, customOptions)).catch(err => {
        throw err
    })
}


module.exports = bundler => {
    const { rootDir, outDir } = bundler.options
    distDir = outDir.replace(rootDir, '').substr(1)

    bundler.on('bundled', (bundle) => {
        const serviceWorkerFilePath = path.resolve(outDir, DEFAULT_FILENAME)
        const customOptions = bundle.entryAsset.package.sw
        getServiceWorker({ outDir, customOptions, rootDir }).then(codes => {
            if (customOptions.minify) {
                const compressedCodes = {}
                compressedCodes[fileName] = codes
                codes = UglifyJS.minify(compressedCodes).code
            }
            if (customOptions.swSrc) {
                codes += readFileSync(path.join(rootDir, customOptions.swSrc))
            }
            writeFileSync(serviceWorkerFilePath, codes)
            console.log(`😁 Service worker "${distDir}/${customOptions.fileName}" generated successfully.`)
        }).catch(err => {
            console.log(`🤯 Service worker generation failed: ${err}`)
        })
    })
}
