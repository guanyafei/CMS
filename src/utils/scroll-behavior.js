const scrollFunc = (to, from, savedPosition) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (savedPosition) {
        resolve(savedPosition);
      } else {
        resolve({ x: 0, y: 0 });
      }
    }, 500);
  });
};
export default scrollFunc;
