module.exports = (self) => {
  self.pushAssets = () => {
    self.pushAsset('stylesheet', 'user', { when: 'user' });
    self.pushAsset('script', 'page-scan-modal', { when: 'user' });
    self.pushAsset('script', 'user', { when: 'user' });
  };
};
