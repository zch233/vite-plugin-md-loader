Vite 2.x plugin to load MD files

## Install

```
yarn add vite-plugin-md-loader -D
```

## Use

```
import mdLoader from 'vite-plugin-md-loader';


// vite.config

{
  // ...
  plugins: [mdLoader()]
}
```

```
import xxx from './xxx.md'
import yyy from './yyy.md?raw'

console.log(xxx)
// <h1>...</h1>
// <p>...</p>
// <ul>...</ul>

console.log(yyy)
// raw data
// # xxx
// xxx
// - xxx
// - yyyy
```
