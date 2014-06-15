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
comp.js uses [npm](https://www.npmjs.org/)([nodejs](http://nodejs.org/)) and [bower](http://bower.io/) to manage dependancies

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
- git doesn't save softlinks???
- allow users to register and unregister systems during runtime
- systems needs initialize function for engine to call upon start - actual it only for static function and their component function is called upon engine initialization.
- allow to change engine SKIP_TICK and other const variables.
- removing system but leaving other systems that depend on it may cause issues: (ie: start engine -> remove system -> restart engine -> dependency system not found -> exception thrown).
- systems can remove/add other systems during runtime, but they can't restart the engine, as it may cause stack overflow, solution: engine will restart it self after each cycle if system is added or removed(when unregisterSystem/registerSystem called set a restart flag to true).
- add staticEntity as invalid entity names or give static entity special treatment.
- and maybe rename KeyboardState to just keyboard, as it no longer represents a state.
- create cleanup function for when component is destroyed.
- never use same component instance for more then one entity, make core handle the creation of duplicated components each engine loop. ??? is it talking about static systems?
- creating entity should allow the setting of initial components values.
- in some systems we reset component each loop(HIDCombos) and in some we don't(Transform) how do we decide it, should it be unified(always reset or never)
- make correct description for systems
- should i make a system that benefits from IO immediate processing and Logic constant processing?
- should we have something else to upgrade transformWorld beside hierarchy?
- update grunt-contrib-jasmine to newest version(this will require to upgrade jasmine as-well)
- add tests to wheelMovement
- add tests for exclusive combos are now categorized also by trigger type
- maybe separate HIDComboState into 2 systems one is registering the combos and is logic type the other is IO type and calculates the triggered combos
- create this.name in system so we won't have to write the system name each time
- update lodash and use _.now() instead of performance.now()
- there is no point in Logic, interpolation and IO there should be only Logic and Output, input is part of logic, interpolate is part of the output
- keyboard and mouse should buffer their changes just like HIDComboState does
- fix system's dependencies validation to check 'requiredDependencies' and allow non static system to depend ('dependencies') on static system - fix tests


### Develop Notes
This engine works as a giant factory filled with conveyor belts, each component makes his way along the belt towards stops, the systems which modify the components based on other previous components related by entity.

creating new system:
- data is always in the entity
- logic is always in the process system
- you can store variables in the system but only if it static and not changed between entities
- system can change only components of other systems it depends directly or indirectly(never change system that are in-front of you)
- it's ok to set initial value just to make the system function, but initial value that specified by user takes precedence.
- IO systems are for high frequency input gathering but not processing, all processing of input should be done in Logic systems, high frequency is mandatory to catch as much keys as possible and later calculate the changes from previous state to current

create cycleContinuous:
- you pass array of function representing each engine loop
- engine is not restarted after each loop!!!


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