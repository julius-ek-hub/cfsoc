const useLocalStorage = (props) => {
  const { sufix = "" } = props || {};

  const toJSON = (v) => JSON.stringify(v);
  const fromJSON = (v) => JSON.parse(v);

  return {
    get(key) {
      const v = localStorage.getItem(sufix + key);
      try {
        return fromJSON(v);
      } catch (error) {
        return v;
      }
    },
    set(key, value) {
      localStorage.setItem(sufix + key, toJSON(value));
    },
    remove(key) {
      localStorage.removeItem(sufix + key);
    },
  };
};

export default useLocalStorage;
