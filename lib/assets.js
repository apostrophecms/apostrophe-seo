module.exports = (self) => {
  self.pushAssets = () => {
    self.pushAsset('stylesheet', 'user', { when: 'user' });
    self.pushAsset('script', 'bundle', { when: 'user' });
  };
};
