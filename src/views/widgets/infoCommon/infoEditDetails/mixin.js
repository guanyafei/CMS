export default {
  methods: {
    transToSameKey(list = [], option) {
      return (list || []).reduce((perVal, val) => {
        let tempObj = {};

        Object.keys(option).map(keyItem => {
          tempObj[option[keyItem]] = val[keyItem];
        });

        perVal.push(tempObj);

        return perVal;
      }, []);
    }
  }
};
