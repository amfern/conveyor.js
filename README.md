Comp js
===

Game engine implementing ECM(EntitySystemComponents) paradigm.


### How to use
You need to:
* define all systems `new COMP.System.IO|Interpolation|Logic`
* define all entities `new COMP.Entity`
* start the engine `COMP()`
* define all entities `new COMP.Entity`

note: doing it in other order will not work


```javascript
cooode 
code 
more code
```

### Notes/gotcha


### Maintainer

[Ilia guterman](https://github.com/amfern)

### Developers

Install dependencies

`sudo npm install`

Build Project

`grunt build`

Run Tests

`grunt debug`
or open `_SpecRunner.html` in your browser

note: running `grunt debug` or `grunt build` will install bower packages

Browse examples

`http://<localhost>:9001/<basic|logic|interpolation|IO>/<example name>.html`
`basic example: http://10.0.0.45:9001/basic/index.html`

### TODO
deal some how with round dependencies - or just leave stack overflow exception
allow user to extract visual represintation of dependencies from engine
git doesn't save softlinks???
allow users to register and unregister systems during runtime
systems needs initialize function for engine to call upon start
allow to change engine SKIP_TICK and other const variables
removing system but leaving other systems that depend on it may cause issues: (ie: start engine -> remove system -> restart engine -> dependency system not found -> exception thrown)
systems can remove/add other systems during runtime, but they can't restart the engine, as it may cause stack overflow, solution: engine will restart it self after each cycle if system is added or removed(when unregisterSystem/registerSystem called set a restart flag to true)
add staticEntity as invalid entity names or give static entity special treatment

### Target
the benefit of upload html5 app is internet connection, so we can leverage server powers to calcualte AI or ggather vital player information to teach AI to performer better. also all players will fight an AI revision the constructed of players best move(lol show whoo made this move in the side notification)
build a fast passed game targeting gameplay, tactics, inviting the player to expolit it vast new laws of phisics to achieve an epic battles and moves.

### License

The MIT License (MIT)

Copyright (c) 2013 amfern

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.