# parcel-plugin-sw-precache2

Another Parcel plugin for service-worker with full `sw-precache` configurations support.

Inspired by https://github.com/cyyyu/parcel-plugin-sw-precache

### Installation

`yarn add -D parcel-plugin-sw-precache2`

### Configurations (add to packages.json in 'cache' section)

- **swSrc[String]** merge your own sw rules to service-worker.js
- **minify[Boolean]**
- **cacheId[String]**

See fully configurations at https://github.com/GoogleChromeLabs/sw-precache