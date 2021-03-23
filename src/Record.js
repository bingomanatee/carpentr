export default class Record {
  constructor(params) {
    const {
      identity, props, meta, status, store,
    } = params;
    this.identity = identity;
    this.props = props;
    this.meta = meta;
    this.status = status;
    this.store = store;
  }
}
