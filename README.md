conveyor.js [»»»»]
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
conveyor.js uses [npm](https://www.npmjs.org/)([nodejs](http://nodejs.org/)) and [bower](http://bower.io/) to manage dependancies

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
Features:
    - allow to change engine SKIP_TICK and other const variables.
    - deal some how with round dependencies - or just leave stack overflow exception.
    - allow user to extract visual representation of dependencies from engine.
    - ResourceManager - static, read Resources, loads them and stores in self components.
    Resources - object of systems, each containing array of resources to load
Allow users to register and unregister systems during runtime:
    - removing system but leaving other systems that depend on it may cause issues: (ie: start engine -> remove system -> restart engine -> dependency system not found -> exception thrown).
    - systems can remove/add other systems during runtime, but they can't restart the engine, as it may cause stack overflow, solution: engine will restart it self after each cycle if system is added or removed(when unregisterSystem/registerSystem called set a restart flag to true).
Performance:
    - if we move to DB for storing components we can elevate the use of of events. with events we can collect only the entities which component has been changed in relative to which components the system depends, and pass it to system so it could optionally iterate only over them instead of every thing(in addition all entities are passed) - but then we have to figure out what changed, maybe it is best just to compute it and be done?.
    - maybe it is possible to enhance performance by avoiding cache-misses by aggregating the systems's components together? http://gamesfromwithin.com/data-oriented-design
    - consider exploring the direction of GO-lang because their concurency model is much better then waiting for each system to finish
    - components array should be in the system and referenced by entity.id(generate this as three.js does), unlike the situation right now where systems contains entities and then references to it's component through entity
    or i create array of entities compromised only of the requiredDependencies's components and pass it into the proccess() input.(yes, yes a struct)
    creating thus structs means copying lots of data, it cancels out the cache performance boost.
    
    ------------------------------------------------------------
        Systems and components should be split, because not all systems have components, nor all components belong to system.

        This means instead of defining entity out of components, we define it out of systems and thus systems have required components.

        But the question remains - what do we do with the initial components values.
        Do we define "componentsInitials" array and "systems" array? no.
        User defines collection(array or object) of "components". if it names matches any system name, this system will be added, if a components exists with the same name it will be added also. If system not found but component exists, just the component will be added. If nothing found throw an error...
        This "components" collection also acts as default component value definition.

        Redefined System-entity-component relationships:
        Entity - have array systems/components it depends on, and after initialized acts as the glue between components when system is processing them, by string the component in self.
        System - have array of components it requires and array of systems it depends on it
        Component - Defines the data
    ------------------------------------------------------------
Develop Environment:
    - maybe use connect-assets or any other better tool as build script


### Roadmap
1. bootstrap game systems
2. simple physic system
3. sound system output
4. simple AI system
5. build the demo game


### Develop Notes
This engine works as a giant factory filled with conveyor belts, transporting small packages which represented by a component class, each system creates it own component and different component are tied together to create entity.
Thus components makes their way along the belt towards different stations represented by System class.
Entities journey starts at the Input systems, and are passed from system to system in fashined order, on the way entities's components are manipulated by the systems, until eventualy they reach IO systems again and a frame is created, this loop will repeat it self for each frame.

This engine is open source in a way linux is, every one can create system, share it with conveyor package manager, and any one else can download it and use this system as he wish. for example i created cool bullet model animation i can share it and some one else will attach this model to input keydown of his own and use it in his game with minimal effort.

AI is just evolution and survival of ideas, the good ones will be used more often and passed on, the bad ones will be used less and discarded untill AI is full of the best ideas


Never start game with tutorial or story, start it with gameplay and action, let the player experience the fun of your game before diving into the story




Best practices when creating new system:
- data is always in the entity
- logic is always in the process system
- you can store variables in the system but only if it static and not changed between entities
- system can change only components of other systems it depends directly or indirectly(never change system that are in-front of you)
- it's ok to set initial value just to make the system function, but initial value that specified by user takes precedence.
- IO systems are for high frequency input gathering but not processing, all processing of input should be done in Logic systems, high frequency is mandatory to catch as much keys as possible and later calculate the changes from previous state to current
- system's dependencies will also include requiredDependencies by design.
- system that act a collection for other systems(RenderMeshes) are never reseted. Their component should be of object type containing array per dependent system, so each system can reset it own collection without interfering with others, in-spite it can, as the whole component is accessible to it

create cycleContinuous:
- you pass array of function representing each engine loop
- engine is not restarted after each loop!!!


### Target
the benefit of upload html5 app is internet connection, so we can leverage server powers to calcualte AI or gather vital player information to teach AI to performe better. also all players will fight an AI revision the constructed of players best move(lol show who made this move in the side notification)
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