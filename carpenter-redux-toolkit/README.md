# Carpentr Redux Toolkit

This module uses the Carpentr patterns as implemented by the Redux Toolkit. 

## `makeSources(nameKey: string = 'sources'): `slice`

makeSources is a function that produces a **redux-toolkit slice**. Slices have
the following properties:

* reducer: function
* actions: {actionName: fn, .... actionName: fn}

### fields

* **sources**: Map contains Source instances (see below).
* **quests**: rxjs Subject is a pubSub broadcaster 
  for messages about updates; it emits single `Quest` instances (see below). 

### actions

The properties after the action name define the payload.

* **addSource**: `{name: <key>,  members: Map?, hooks, params, ...rest }` adds a new source to the store. 
  note - params and (rest) are redundant, and contain any custom parameters for the source.
* **onQuest** `{handler: fn} | fn` listens for any new quest that is created to allow a handler to 
  claim it (via `quest.start()`). At that point no other onQuest listeners will be called for the quest. 
* **setSourceKeyVal** `{source: <key>, key: <key>, value: any}` sets a named value for a named source for a given key.   
  This method will create a new source if necessary. 
* **delSourceKey** `{source: <key>, key: <key}` deletes a named key in a names source - if it exists.  
* **quest**: `{source: string? question: any, meta: any, $cb: fn? $obs: rxjs:obserer}` returns a new Quest;
  the payload contains initial values for the QuestValue that is the value of the quest. The quest is emitted
  as a value from slice.quests.<br />
  There are two special properties:
  * **$cb** function? if present, is a function that receives the new Quest instance. 
  * **$obs** is a `subscribe()` argument ({next: fn?, error: fn?, complete: fn?}) which subscribe
     to the quest. 
    

#  Question Solving via Streams

The sources slice has a questions stream. Questions are not *stored* in redux, by default; instead, the questions are resolved
into external activity that my trigger update actions, and subscribers receive a summary of work done. This is becuase
there is no good reason to refresh *views* or dom while the quest is underway -- unless the quest generates actual
data changes -- in which case the change actions trigger updates. 

## Quest

A quest is an augmented rxjs:BehaviorSubject that emits an immer draft of a QuestValue 
until the quest is completed. 

Quests have the following helper methods:

* **start**(): advances the value to status QS_WORKING. Throws if called on a claimed question.
* **finish**(answer?): sets the answer and advances the quest to state QS_RETURNED; then QS_COMPLETED; then completes the stream. 
  Can only be called if the current status is QS_WORKING.
* **fail**(error?): sets the answer to the error and advances the quest to state QS_FAILED; then completes the stream. 
  Can only be called if the current status is QS_WORKING.
* **meta**(meta: any): emits a new value whose meta is set to the first parameter.

Quests also have the following properties:

* **isClaimed** - boolean: true only if the quest's status is QS_NEW (and is not completed). 
* **status** - Symbol() - accesses the values' status. Note -- even completed quests will return QS_FAILED or QS_COMPLETED
* **source** - an accessor to the values' source property  

## QuestValue

A QuestValue is the signature for values that are emitted from Quest; they are Immer drafts (immutable). Each QuestValue has a **status** property

* QS_NEW --the state of a new ("unclaimed") question
* QS_WORKING -- the state of a working ("claimed") question
* QS_RETURNED -- the state of a question with a valid answer. 
* QS_COMPLETED -- a returned answer that has been saved to the sources, and filtered/post-processed as necessary
* QS_FAILED -- a quest that recieved an error from a remote source. (note - if the quest fails for other reasons,
  it may not reach this state; watch the error() observable hook for those situations)

Under ordinary circumstances a Quest should only emit one QuestSubject in each state; i.e., only one emission 
should exist for a single quest with the status QS_WORKING; except for QS_RETURNED, which might have several
emissions as the quest is refined. 

It may skip some of these states before it is complete, but it will always change state in this order. 
If you want to know the final value for a given quest:
1. watch for the quest to reach the QS_COMPLETED status to emit from next();
2. listen for quest stream errors 
3. watch for the quest to reach the QS_FAILED status to emit from next(); 

You *will not be able to get or observe the value of a quest after its stream is completed; in rxjs, that
means, its no longer available to emit/change.

### QuestValue properties:

* **source** <key?>: the name for the source that the quest is concerned with. A multi-quest source might exist,
  but if a quest is single-source its key should be named.
* **key** <key?>: A unique read-only identifier for the quest. Can be defined in construction, and if missing will be creatd by nanoid
* **question** : the request data that indicates exactly what is being requested; application specific. 
* **status** <Symbol>: see above
* **meta** any?: any other useful passed-around value. application specific and optional. 


*Example:*

If you have a 

# Rollup starter kit readme

this module was built using someone else's rollup starter kit; its documentation follows below, for reference

![build](https://github.com/georapbox/rollup-library-starter-kit/workflows/build/badge.svg)
[![Dependencies](https://david-dm.org/georapbox/rollup-library-starter-kit.svg?theme=shields.io)](https://david-dm.org/georapbox/rollup-library-starter-kit)
[![devDependency Status](https://david-dm.org/georapbox/rollup-library-starter-kit/dev-status.svg)](https://david-dm.org/georapbox/rollup-library-starter-kit?type=dev)

# rollup-library-starter-kit

Rollup starter kit for creating libraries (Input: ES6, Output: UMD, CommonJS, ESM)

## Features

- Rollup 2.x.x
- Babel 7
- ES6 as a source
- Exports in UMD, CommonJS, ESM formats
- ES6 test setup with [Jest](https://jestjs.io/)
- Linting with [ESLint](https://eslint.org/)
- Basic [Travis](https://travis-ci.org/) configuration

## Getting started

### 1. Setup the library's name

- Open `rollup.config.js` and change the value of `LIBRARY_NAME` variable with your library's name.
- Open `package.json` and change the following properties with your library's equivalent
  - `name`
  - `version`
  - `description`
  - `main`
  - `module`
  - `browser`
  - `repository`
  - `author`
  - `license`
  - `bugs`
  - `homepage`

### 2. Install dependencies

- Run `npm install` to install the library's dependencies.

### 3. Build for development

- Having all the dependencies installed run `npm run dev`. This command will generate `UMD` (unminified), `CommonJS` and `ESM` modules under the `dist` folder. It will also watch for changes in source files to recompile.

### 4. Build for production

- Having all the dependencies installed run `npm run build`. This command will generate the same modules as above and one extra minified `UMD` bundle for usage in browser.

## Scripts

- `npm run build` - Produces production version of library modules under `dist` folder.
- `npm run dev` - Produces a development version of library and runs a watcher to watch for changes.
- `npm run test` - Runs the tests.
- `npm run test:watch` - Runs the tests in watch mode for development.
- `npm run test:coverage` - Runs the tests and provides with test coverage information.
- `npm run lint` - Lints the source code with ESlint.
- `npm run prepare` - Run both BEFORE the package is packed and published, on local npm install without any arguments, and when installing git dependencies.
- `npm run clean` - Deletes `dist` and `coverage` folders.

## Misc

- By default all source code is located under the `src` folder.
- Be default `dist` folder is excluded from source control but included for npm. You can change this behavior by not excluding this folder inside the `.gitignore` file.
- The starter kit assumes that all tests are located under `test` folder with `.spec.js` extension.

## License

[The MIT License (MIT)](https://georapbox.mit-license.org/@2019)
