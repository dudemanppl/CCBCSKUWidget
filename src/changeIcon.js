chrome.runtime.onMessage.addListener(
  ({ onCompetitiveCyclist }, { tab: { id: tabId } }) => {
    if (!onCompetitiveCyclist) {
      chrome.pageAction.setIcon({ path: 'images/bc.png', tabId });
    }
  }
);
