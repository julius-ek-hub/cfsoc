const useLocalStorage = () => {
  const toJSON = (v) => JSON.stringify(v);
  const fromJSON = (v) => JSON.parse(v);

  return {
    get(key) {
      const v = localStorage.getItem(key);
      try {
        return fromJSON(v);
      } catch (error) {
        return v;
      }
    },
    set(key, value) {
      localStorage.setItem(key, toJSON(value));
    },
    remove(key) {
      localStorage.removeItem(key);
    },
  };
};

export default useLocalStorage;
