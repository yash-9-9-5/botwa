interface DataStore {
  messages: Record<string, any>;
  groupMetadata: Record<string, any>;
  contacts: Record<string, any>;
}

const dataStore: DataStore = {
  messages: {},
  groupMetadata: {},
  contacts: {},
};

export default dataStore;
