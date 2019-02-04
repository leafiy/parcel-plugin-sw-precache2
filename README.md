# parcel-plugin-sw-precache2

Another Parcel plugin for service-worker with full `sw-precache` configurations
support.

Inspired by https://github.com/cyyyu/parcel-plugin-sw-precache.

## Installation

```
npm i -D parcel-plugin-sw-precache2
```

or

```
yarn add -D parcel-plugin-sw-precache2
```

## Configurations (add to your `package.json` in `sw` section)

#### fileName [String]
Custom name for the auto-generated file containing the service worker script.

Default: `service-worker.js`.

#### swSrc [String]
Merge your own service worker rules to the auto-generated file.

Default: `''`.

#### minify [Boolean]
Minifies the generated code.

Default: `true`.


#### cacheId[String]
A string used to distinguish the caches created by different web applications
that are served off of the same origin and path.

Default: `''`

### Other configurations
The plugin supports all the settings provided by **sw-precache**.

See fully configurations at https://github.com/GoogleChromeLabs/sw-precache.

##### Example

`package.json`:

```json
{
  "name": "an-awesome-node-project",
  "description": "An awesome project!",
  "version": "1.0.0",
  "main": "index.js",
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "parcel-bundler": "^1.1.0"
  },
  "sw": {
    "fileName": "sw.js",
    "swSrc": "./path/to/sw.js",
    "minify": true,
    "cacheId": "awesome-cache"
  }
}
```
