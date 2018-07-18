'use strict';
class ConstantArr extends Array {
  getItemByKey(key) {
    let temp = this.find(item => {
      return item.key == key;
    });
    return temp ? temp : {};
  }
  getItemByValue(value) {
    let temp = this.find(item => {
      return item.value == value;
    });
    return temp ? temp : {};
  }
}

export default list => new ConstantArr(...list);
