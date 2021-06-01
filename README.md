# CARPENTR

Carpenter is an attempt to create a homogenous record system for information
transfer. 

It is a monorepo because it manages the same architectural system in multiple patterns. 

## The Name

Carpentr is named after the character in *Alice in Wonderland*:

    The Walrus and the Carpenter
    Were walking close at hand
    The beach was wide
    From side to side
    But much too full of sand
    Mr. Walrus!
    Said the Carpenter
    My brain begins to perk
    We'll sweep this clear
    In 'alf a year
    If you don't mind the work

## The pattern

The most fundamental pattern of Carpentr is this: a **client** asks for **data** contained in a **source**. 
The response is either the data, or an asychnronous structure that returns the data -- or an error if the data is irretrivable. 

### Sources

Sources are collections of information. They are often local proxies for remote data stores -- "sources of truth."

Sources have both methods to retrieve data and caches of the data that have been retrieved. 

#### Data

Data has no limitations, by definition. It can be 

* Strict and uniform (with a schema) or "messy" (no fixed schema) 
* in any form or structure - classes, POJO, strings, arrays

The easiest data to work with in general has 

* a defined schema 
* is composed of scalar values 
* can pass the "Can I JSON.stringify() it" test (i.e, no loopy references or problematic stuff like DOM elements)

#### Keys
Things in Carpenter have keys, or IDs. Keys are:
* simple -- usually scalar: strings, numbers, or forms that can be expressed
* have the same lifespan as the data itself, and are unique in the population of the Data.
* uniquely identify a subject in a given space. 
* are singular; This generally means that a subject has one and only one key, but
  keys *always* have one and only one subject.
* are permanent; subjects' keys don't change, even if the subject does, and keys are not reusable; i.e., an array index
  is *a poor key* for imformation as arrays are mutable. 
  
All the entities named below have keys. 

#### Data Maps

Sources store data based on the following assumptions

* Data is delivered in units of information that in the remote source of truth are identified keys
* Quests provide answers in the form of key(s) that point to Sources -- not data itself. 

When the data is returned, what is fed back to the request is the key, which is stored locally. This means that any time
the data changes (or is deleted) the clients will receive an update.

In general the assumption is that the order of storage in s source is meaningless -- if there is an order, it is
part of the result  of a quest. 

Sources themselves have an identifying key.

#### Quests

Quests are expressions of a need of data on the part of a Client. They may be solved by HTTP (Requests) or a reduction of data
that is already present in stores (filters). A quest can be:

1. A request for data, raw, formatted or aggregated. 
2. A change request -- remote insertion, deletion, updating of data.
3. A transmission -- acknowledgement of receipt, or anything else that is not 1 or 2.

Quests may be stored as data -- or may be a functional concept that is passed through hook or promise-patterns to the caller. 

Quests are *messages* designed to trigger updates both to the store and the remote source APIs. 
They have the following properties:

* key (a nanoid string)
* question - a value meaningful to the responding hooks
* answer - documents the result of any activity that hooks have taken to resolve the quest
* meta - any annotations such as pagination cursors that were returned from the source of truth

If the need for answer and meta are unclear, consider that the raw HTTP response is one candidate for the answer field,
and it is filtered into a cleaner application friendly format in meta. 

##### A basic example

* A client 'user_panel' wants to get information about user 100; the panel emits a quest by calling:

```javascript

sources.quest({source: 'users', key: 100, $cb: (quest) => {
// questValue is going to be a copy of the latest known version of the quest before it completed/errored out.
// because BehaviorSubjects have no retrivable value after they have completed 
// its the best way to get the "current" value of the quest. 
    let questValue;
    const sub =  quest.subscribe({
      next(q) {
        questValue = q;
        if (q.status === QS_COMPLETED) {
          console.log('quest has been completed: ', q.answer);
          sub.unsubscribe();
        }
      },
      error(e) {
        console.log('oh no! error in asking', questValue.question, ':', e.message);
      },
    });
  }});
```

* a subscriber to the quests streams makes a call to the Users API. It also updates the quest to status `QS_WORKING`

* That subscriber recieves a response with user data

* The subscriber calls an action to inject user 100's data into the Users source. 

* The subscriber updates the quests's data / metadata to note that user 100 has been updated, 
  by calling `quest.finish({source: 'users', key: 100})`.

* This advanced the quest to state "QS_RETURNED" then to "QS_COMPLETED". 

* with the final state, the callback is notified that the quest has been resolved, and performs whatever view updates
  are relevant with the new user data from the source. 
  
##### Questions

Questions are configuration options. They can be REST-like: `{source: 'users', method: "get", id: 100}` or any other 
form that is meaningful to your handlers. 

##### Answers

The form of the answer again, is that which is meaningful to the subscribers to the quest.
Answers are ultimately *commentary* -- the quest triggers change to the store, and the answer to the quest 
is a manifest summary of that work. Ultimately the purpose of a quest is to trigger updates; the library itself doesn't 
react to the form or content of any quest's answer. 

Here are a few *suggested* forms the answer could take. 

1. A Data: `{data: key, source: sourceId, form: 'ONE_DATA'}` one record. 
2. A SourceSet: `{data: [key, ...key], source: sourceId, form: 'SOURCE_DATA'}` 0+ records from a single source.
3. A SourceSetList: `{data: [[sourceKey, [key, key, key]], ...[sourceKey, [key, key, key]]], form: 'SOURCE_LIST'}`, multi-source data
4. An Error: `{data: string, errorData? any form: 'ERROR'}` can be a trapped/thrown error or a remote message describing the failure;

It is assumed that by the time the quest has been finished, the sources' caches have also been updated with any data provided by the quest, which 
the client can then retrieve from the source if needed. 

Another interpretation: the "answer" can be a raw body response. That response is refined by handlers into a form -- put into meta -- that is meaningful to your application.
That way if you suspect your filters are misbehaving, answer will always have the full HTTP response for you to examine and compare against meta. 

#### Clients 

A client is a very broad and general use structure. It can be mapped to a view. It may (or may not) have values that aren't in caches. 
Clients are identified by keys. They are stored flatly, but can be organized with local inter-client references. 

As far as Carpenter only two things are important: 

1. Quests are made on behalf of clients
2. If a client is removed, the Quest does not need to be complete.

Other than a name, clients have no defined features or schema. 
They may be complex stores, or simply references for a pub-sub system. 
One important utility clients provide is that when editing data, clients can keep local copies of the edits for use in a future Quest.
A client is not bound to any specific sources and should not copy / denormalize source data. 
