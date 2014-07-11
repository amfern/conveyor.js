CONV.js [»»»»]
===

Game engine implementing ECM(EntitySystemComponents) paradigm.


### How to use
You need to:
* define all systems `new CONV.System.IO|Interpolation|Logic`
* define all entities `new CONV.Entity`
* start the engine `CONV()`
* define all entities `new CONV.Entity`

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
CONV.js uses [npm](https://www.npmjs.org/)([nodejs](http://nodejs.org/)) and [bower](http://bower.io/) to manage dependancies

`sudo npm install`
`bower install`

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
- deal some how with round dependencies - or just leave stack overflow exception.
- allow user to extract visual representation of dependencies from engine.
- allow users to register and unregister systems during runtime
- systems needs initialize function for engine to call upon start - actual it only for static function and their component function is called upon engine initialization.
- allow to change engine SKIP_TICK and other const variables.
- removing system but leaving other systems that depend on it may cause issues: (ie: start engine -> remove system -> restart engine -> dependency system not found -> exception thrown).
- systems can remove/add other systems during runtime, but they can't restart the engine, as it may cause stack overflow, solution: engine will restart it self after each cycle if system is added or removed(when unregisterSystem/registerSystem called set a restart flag to true).
- if we move to DB for storing components we can elevate the use of of events. with events we can collect only the entities which component has been changed in relative to which components the system depends, and pass it to system so it could optionally iterate only over them instead of every thing(in addition all entities are passed) - but then we have to figure out what changed, maybe it is best just to compute it and be done?.
- maybe it is possible to enhance performance by avoiding cache-misses by aggregating the systems's components together? http://gamesfromwithin.com/data-oriented-design
- HIERARCHY: when caluclating matrices create a buffer to check if somethink was already calcualted
- should we have something else to update transformWorld beside hierarchy? ye a static transform
- all systems should address the default value that may come to them
- InterpolateHierarchy should inhirate functions from Hierarchy



### Develop Notes
This engine works as a giant factory filled with conveyor belts, transporting small packages which represented by a component class, each system creates it own component and different component are tied together to create entity.
Thus components makes their way along the belt towards different stations represented by System class.
Entities journy starts at the Input systems, and are passed from system to system in fashined order, on the way entities's components are manipulated by the systems, until eventualy they reach IO systems again and a frame is created, this loop will repeat it self for each frame.


Best practices when creating new system:
- data is always in the entity
- logic is always in the process system
- you can store variables in the system but only if it static and not changed between entities
- system can change only components of other systems it depends directly or indirectly(never change system that are in-front of you)
- it's ok to set initial value just to make the system function, but initial value that specified by user takes precedence.
- IO systems are for high frequency input gathering but not processing, all processing of input should be done in Logic systems, high frequency is mandatory to catch as much keys as possible and later calculate the changes from previous state to current
- system's dependencies will also include requiredDependencies by design.
- system that act a collection for other systems(RenderMeshes) are never reseted. Their component should be of object type containing array per dependent system, so each system can reset it own collection without interfering with others, although it can, as the whole component is accessible to it

create cycleContinuous:
- you pass array of function representing each engine loop
- engine is not restarted after each loop!!!


### Target
the benefit of upload html5 app is internet connection, so we can leverage server powers to calcualte AI or ggather vital player information to teach AI to performer better. also all players will fight an AI revision the constructed of players best move(lol show whoo made this move in the side notification)
build a fast passed game targeting gameplay, tactics, inviting the player to expolit it vast new laws of phisics to achieve an epic battles and moves.
The Input to player movement should be instant like in mario and not prince of persia the first.

### License

The MIT License (MIT)

Copyright (c) 2014 amfern

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