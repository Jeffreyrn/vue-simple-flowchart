# vue-simple-flowchart

## Introduction

a Vue.js flowchart editor component, lightweight, code with vanillaJS, [Demo](https://jeffreyrn.github.io/vue-simple-flowchart/demo/)

### Feature

- drag to connent two node, click to delete link
- support add, delete, save node
- reactive flowchart data
  
### Usage

install via npm/yarn

```
yarn add vue-simple-flowchart
```

import in script

```js
import SimpleFlowchart from 'vue-simple-flowchart';
import 'vue-simple-flowchart/dist/vue-flowchart.css';
```
register the component, and add below to html:
```html
<simple-flowchart :scene.sync="data"></simple-flowchart>
```
then set data for flowchart component, for example:
```js
data() {
    return {
        data: {
            centerX: 1024,
                centerY: 140,
                scale: 1,
                nodes: [
                    {
                        id: 2,
                        x: -700,
                        y: -69,
                        type: 'Action',
                        label: 'test1',
                    },
                    {
                        id: 4,
                        x: -357,
                        y: 80,
                        type: 'Script',
                        label: 'test2',
                    },
                    {
                        id: 6,
                        x: -557,
                        y: 80,
                        type: 'Rule',
                        label: 'test3',
                    }
                    ],
                    links: [
                    {
                        id: 3,
                        from: 2, // node id the link start
                        to: 4,  // node id the link end
                    }
                ]
        },
    };
}
```

### Component

#### Attributes

- height, type: Number, default: 400

#### Events

- nodeClick, emit when node click, event = nodeID
- nodeDelete: emit when node deleted, event = nodeID
- linkBreak: emit when the selected link deleted, event = {id, from, to} (deleted link Object)
- linkAdded: emit when new link added, event = {id, from, to} (new link Object)
- canvasClick: emit when canvas click, event = { (Event Object) }

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

## TODO

- Add horizontal mode
- Optimizition for large node array
- Theme color configurable
- Remove Console.log in build mode
