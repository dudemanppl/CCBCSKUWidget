chrome.runtime.onMessage.addListener(
  ({ onCompetitiveCyclist }, { tab: { id: tabId } }) => {
    chrome.pageAction.show(tabId);
    if (!onCompetitiveCyclist) {
      chrome.pageAction.setIcon({ path: "images/bc.png", tabId });
    }
  }
);
