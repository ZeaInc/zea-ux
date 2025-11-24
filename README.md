# Zea UX

[![NPM Package][npm]][npm-url]
[![Build Size][build-size]][build-size-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]

# Introduction
There are a features that are user specific, not something everyone needs; therefore we created the Zea Ux plug-in. It adds powerful features to the engine, that enrich the user experience like creation tools, UndoRedo System, etc.
</br>
</br>
</br>

# Documentation
Full documentation with concepts, tutorials, live examples, API documentation and more; can be found at the zea ux docs site:
[https://docs.zea.live/zea-ux](https://docs.zea.live/zea-ux)

These docs allow developers to get started with the Zea UX by downloading free and open-source demo content and using Zea's publicly distributed client-side libraries.
</br>
</br>
</br>

# Licensing
The Zea UX plug-in is under a [`MIT`](https://en.wikipedia.org/wiki/MIT_License) license.
</br>
</br>
</br>

# Add it to your project
The process to add Zea UX to your projects is easy.

## *Development Setup*
This project depends on private `@zeainc` packages hosted on GitHub Packages. To install dependencies locally, you need to configure authentication in your global npm configuration:

1. Create a GitHub Personal Access Token (classic) with `read:packages` scope:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `read:packages` permission

2. Add the token to your global `~/.npmrc` file:
   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
   ```

3. Now you can install dependencies:
   ```bash
   yarn install
   ```

> **Note**: The authentication token should only be in your global `~/.npmrc`, never commit tokens to the repository. 

## *Using CDNs*
For static websites or quick implementation you can always use CDNs like JsDelivr or Unpkg:

### *JsDelivr*
```html
<script crossorigin src="https://cdn.jsdelivr.net/npm/@zeainc/zea-ux/dist/index.umd.min.js"></script>
```
### *Unpkg*
```html
<script crossorigin src="https://unpkg.com/@zeainc/zea-ux/dist/index.umd.js"></script>
```
### *Use it*
```html
<script>
  const { UndoRedoManager } = globalThis.zeaUx
</script>
```

## *As a Module*
But if you want to use it like a module, then install the package in your project using `npm` or `yarn`:

```bash
npm i @zeainc/zea-ux
## Or
yarn add @zeainc/zea-ux
```

### *Use it*
```javascript
import { UndoRedoManager } from '@zeainc/zea-ux'
// ...
```
</br>
</br>
</br>

# Dependencies
This plug-in depends on [ZeaEngine](https://docs.zea.live/zea-engine). So, if you're using CDNs, make sure to import it before UX.
</br>

> For questions on licensing, please fill out the contact form on our website: [_zea.live_](https://www.zea.live/contact-us)

[npm]: https://badge.fury.io/js/%40zeainc%2Fzea-ux.svg
[npm-url]: https://www.npmjs.com/package/@zeainc/zea-ux
[build-size]: https://badgen.net/bundlephobia/minzip/@zeainc/zea-ux
[build-size-url]: https://bundlephobia.com/result?p=@zeainc/zea-ux
[npm-downloads]: https://img.shields.io/npm/dw/@zeainc/zea-ux
[npmtrends-url]: https://www.npmtrends.com/@zeainc/zea-ux
