# CARPENTR

Carpenter is an attempt to create a homogenous record system for information
transfer, based on (loosely) the REST paradigm. Records are kept in stores,
which are grouped in baseFactory. Applications can subscribe to individual records,
or entire stores, for updates to record content, or can submit requests to get, delete or
change data. 

Carpentr is based on the Looking Glass engine which in turn is RxJS based, so 
all (nearly) elements are Observable. (records being the most numerous content
are not themselves directly observable, but are contained in an observable field
called records, which can be subscribed/filtered). 

Stores also contain requests which can be watched for and responded to. 
By seperating the request and response into obserable actions you can switch on 
one set of watchers for production and a second mock set of watchers for testing
the system. 

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

# Carpentr Classes

## Store

Stores are produced by the storeFactory function; they are a LGE ValueMapStream. 
Stores are NOT intended to *directly* make REST requests; its not even an 
assumption that the store IS REST baseed. To interact with a remote system,
intercept requests and satisfy them externally. 

### A note on Records

Records are a minimal glob of data. There are only three requirements for records:

1. They must have a distinct *identity* (id) value -- a primary key of some sort -- in order for them
   to be referenced by the system. If for some reason you cannot or do not want them to have an
   identity, manage them outside of the Store until they do. (i.e., you can create a record on your own
   with identity === null but don't try submitting it into the store until it has a unique identity)
   
2. They must have a props Object describing their value; a standard key/value javascript object. 
   if your data is complex or in another form, nest it into an object; i.e., if you want the data to
   be a plain text blurb define it as `{text: 'This is my value'}`
3. They must have a status that is one of the Record statuses in Constants. Any record that comes to'
   the store should be marked as RECORD_STATUS_PERSISTED. 
4. Any data that is not stored in the remote system should be kept in the `meta` property. For instance if you 
   have a list of items in a select field, you might mark one (or more) of them as "selected"
   
Records are Immer drafts; they are not directly mutable. If you want to modify a record you must 
set it with immer produce (exposed by this module) or define a new record with different props
and call `myStore.do.setRecord(identity, newRecord)`. 

For those not up to what Immer is, assume the records to be under `Object.freeze`; all its values
are read-only

### fields

fields are accessed off the `store.my` proxy. (store.my.records) 

* **records**: `records` is itself a ValueMapStream of records, mapped by identity. 
* **requests**: `requests` is a ValueMapStream as well, of `Request` streams. (note: request streams 
  DO NOT update the storeFactory directly as they change;
* **schema** (optional) `schema` exists as a utility to store whatever system you use to
  enforce consistent value in records. 
* **transport** (optional) `transport` exists to store whatever function/class you use
  to send requests back and forth to your backend. 
* **name** the identifier for the store, for convenience. also stored as the `.name` property
  of the store.
  
### methods
  
methods are called from the `store.do` proxy (eg, `mystore.do.request('get', 2)`)
note- this code intentionally makes it difficult to change the identity of a
record from the one that it is keyed by. 

* **`request(action: string, params: any?, options?)): Request`**:
  injects a request into the request collection and triggers an ACTION_NEW_REQUEST event
*  **`onRequest(handler: function): Observer`**:
  registers a listener to respond to any new requests. As it returns an observer, the
   watcher can be cancelled by calling observer.complete() at any time. 
   This method is how you translate a request into a network call. 
* **`getRequest(uuid: string): Request`** gets a request by its UUID.
* **`hasRequest(uuid:string): boolean`**:  determines if a request is registered by an ID
* ** `upsertRecord(identity, props: object, status: Symbol?, meta: object?)`**:
  creates or updates a record. If the record exists, it updates its props -- only.
* ** `createRecord(identity, props: object, status: Symbol?, meta: object?)`**:
  creates or updates a record. If the record exists, it updates its props -- only.
* ** `createRecords(records: Map)`**: create a series of records in one action; transactionally locked. 
* ** `updateRecord(identity, dataOrFn)`**: updates a record by setting a number of fields with a
  pojo, or a mutataor function
* **`mutateRecord(identity, fn): event`**: replaces a record with a new draft,
  based on the identity function. (see Immer)
* **`hasRecord(identity): boolean`**: tests if an identity is registered 
  locally in the store. 
* **`removeRecord(identity) Record`** deletes a record locally; returns it 
  (if it were present).
* ** `record | r(identity)`**: returns a record (if present) from the local store.
