const { writeFileSync, readFileSync } = require('fs')
const path = require('path')
const swPrecache = require('sw-precache')
const UglifyJS = require('uglify-es')

const DEFAULT_FILENAME = 'service-worker.js'
const DEFAULT_CACHE_ID = `parcel-plugin-sw-precache`
const DEFAULT_CACHE_FILE_TYPE = `js,css,png,jpg,gif,svg,eot,ttf,woff,woff2`
const DEFAULT_IGNORE = [
    /\.map$/,
    /manifest\.json$/,
    /service-worker\.js$/
]
const DEFAULT_FALLBACK = '/index.html'


const getServiceWorkder = ({ targetDir, cacheId = DEFAULT_CACHE_ID, customOptions = {}, rootDir }) => {
    const options = {
        cacheId: DEFAULT_CACHE_ID,
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        navigateFallback: DEFAULT_FALLBACK,
        staticFileGlobs: [
            targetDir + `/**/*.{${DEFAULT_CACHE_FILE_TYPE}}`
        ],
        staticFileGlobsIgnorePatterns: DEFAULT_IGNORE,
        stripPrefix: targetDir
    }
    return swPrecache.generate(Object.assign(options, customOptions)).catch(err => {
        throw err
    })
}


module.exports = bundler => {
    const targetDir = bundler.options.outDir
    const { rootDir } = bundler.options
    bundler.on('bundled', (bundle) => {

        const pkg = require(bundler.mainAsset.package.pkgfile)
        const serviceWorkerFilePath = path.resolve(targetDir, DEFAULT_FILENAME)
        const customOptions = bundle.entryAsset.package.sw
        getServiceWorkder({ targetDir, cacheId: pkg.swCacheId, customOptions, rootDir }).then(codes => {
            if (customOptions.minify) {
                const compressedCodes = {}
                compressedCodes[fileName] = codes
                codes = UglifyJS.minify(compressedCodes).code
            }
            if (customOptions.swSrc) {
                codes += readFileSync(path.join(rootDir, customOptions.swSrc))
            }
            writeFileSync(serviceWorkerFilePath, codes)
            console.log(`😁 Service worker generation completed.`)
        }).catch(err => {
            console.log(`🤯 Service worker generation failed: ${err}`)
        })
    })
}