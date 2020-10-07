Carpentr is a store/design pattern that exists to drastically reduce the number of actions required in a
redux/saga/flow-patterned store. Instead of creating discrete actions for innumerable request/responses,
collections are created that reflect the structure of the backend data source.

Requests and Queries are stored and processed by external subscribers so that it is easy for mock stores to
be hooked up to Carpentr stores. put another way: Carpentr is a *registry* that expects the application to 
satisfy pending requests; it has no specific source of information that it targets. You could hook a Carpentr
system up to a REST based network, a local database, file system, github repo, etc. 

To re-emphasize -- *Carpentr is not self contained*; it ceates requests, saves data and lets you populate collections,
but it does *not* call REST endpoints, poll databases, etc; that is the responsibility of its *subscribers* 

## Components of Carpentr

### Collections

Collections are lists of records. They are by default stored in identity object maps. That being said 
there is no specific requirement as to the nature or structure of what a collection stores other than that
*every element of a collection can be identified by ONE AND ONLY ONE identifier*. This is true, for instance,
of database records (that have an ID key). 

* Collections have a unique `name`. 
* There is no meaning to the order of elements in the collection.
* They contain a map called `records` that is a flat collection of CollectionData instances.
* Collections may have a set of `pending` CD that are being prepared but have not been persisted. 
* Collections are of one of two types: *complete* or *incomplete*. Complete collections can be client-side
  processed-sorted, filtered, etc. 

### Collection Identity 

Collections are stored in Javascript Maps; so anything that can be used as a Map key can be used to index collections. 

### Populating collections

Collections are populated by executing queries (which in general are triggered by creating requests). 

### CollectionData (CD for short)

CollectionData is a wrapper around a unit of data that has details as to the context of that data. 
CollectionData has these properties:

* `identity`: a (generally scalar) unique identifier of its data
* `reference`: a "temporary identity" for a record that has not been persisted. I.e., if a View is responsible for
  creating a new article, the Article Collection might have articles with references to allow the view to refer to them. 
  you may have BOTH reference and identity -- when for instance its legitimate for the client to create a record with 
  a specific identity. transient CD's should be stored in views, not in Collections.
* `data`: a nonempty value indicated information retrieved from a store.
* `collection`: the name of the collection it is from. 
* `recieved`: when (javascript timestamp) the record was last validated from the data source. If this field 
   is 0/omitted, the data is assumed to be *transient* and not persisted. 
* `status`: if the record is deleted, the timestamp at which deletion was requested. (can bet treated as boolean

Any/many of these fields might not be set For instance when stored in a collection, 
the collection's name may be left out. A CD of a collection might omit the collections' name, 
and the ID (because it is obvious by context). 

### Questions

Questions are requests for information whose target belongs in a single collection. The most fundamental might be
"get user 100". 
Questions have the following qualities:

* `uuid`: (string) the identifier of the question
* `collection`: '(string)' - the destination of records once they are retrieved
* `request`: 'string/uuid' - the identity of the request that generated the question
* `status`: a string; see "Status" below
* `form`: a description of what particular data you want. 
   Can be a string query, a JSON dsl, a scalar ID, but cannot be empty
* `created`: integer (Javascript timestamp)
* `wait`: optional - number of seconds to wait for satisfaction of the query. I.e., the question is willing to 
  accept cached data. 
* `within`: integer (milliseconds) optional - can be satisfied by cached answers
   created since (created - within). If within is 0 / not set, then the Question will *always* required a 
   visit to the actual data source. 

As a golden rule - a query that is for the same collection and has the same question should all be satisfied by 
the same answer; that is, if three queries for user 100 are made and one gets an answer, that answer should satisfy
all incomplete queries to the user collection 

### Answers

A snapshot of information from a remote data source. Many of its properties mirror those of a Question:

* `question`: string (uuid) of the question that generated the answer. 
* `recieved`: integer (Javascript timestamp) when the data was recieved. 
* `data`: information that satisfies the question. 

### Requests

Requests like questions are prompts to retrieve information. They generate queries. Unlike queries, Requests ...
 
* ...may span one *or more* collections 
* ...requires at least one Question to be satisfied (with a FK in Questions)
* ...are associated with a View. 

* `uuid`: a generated random string uniquely identifying the request
* `view`: a uuid (string) the name of the View that requested the information
* `form`: a description of what you want.
   May be in any form but cannot be empty. 
* `status`
* `created` (Javascript timestamp)
* `cancelled` If a view is completed before all answers have been satisfied

### Views

A view is a hitching post for requests. It corresponds to a React component but depending on your
application structure it can have other implications. 

It has no more specific definition other than *that which makes requests*; every request is made by a view. 

* `uuid`: a unique identity within Carpentr for the view
* `name`: (optional) the functional name of the view. Might be a path; not required
* `status`: a view has only two legitimate states: 'new' or 'done'. 
* `store`: an open-ended collection map for information required by the UI. 

Any pending Requests for a view whose state is set to done are cancelled. 

## Status

Various items can have one value for their status:

* 'new': created; un-processed by any external system
* 'working': a management system has read and taken responsibility for satisfying the target
* 'done': the information/question(s) the target describes have been collected.
* 'cancelled': the need for the data has expired before the request was satisfied.
* 'transient': specific to CD, indicates data in process that hasn't been persisted.
* 'error': a problem in the code or a remote system has prevented the satisfaction of the target
* 'expired': either a request took too long, or a record is considered too old to be trusted and must be re-fetched.

In some circumstances other custom statuses can be used - at your own risk
