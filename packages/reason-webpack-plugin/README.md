# reason-webpack-plugin

<pre align="center">
  yarn add --dev reason-webpack-plugin
</pre>

> Webpack plugin to generate Reason types after compilation

<h3 align="center">
  Add the plugin
</h3>

```js
plugins: [
  new ReasonPlugin({ sources: 'src', output: 'types' })
]
```

<h3 align="center">
  Type your exports
</h3>

```js
// @flow
// math_ops.js

export function add(x: number, y: number): number {
  return x + y
}

export function sub(x: number, y: number): number {
  return x - y
}
```

<h3 align="center">
  Use JS code from Reason
</h3>

```reason
let sum = Math_ops.add 1. 4.2;

let diff = Math_ops.sub 10. 3.1;
```

<h3 align="center">
  Use Reason code from JS
</h3>

```js
// @flow

import { add } from './my_reason_file'

// The `add` function is typed!
const value = add(100, 200)
```