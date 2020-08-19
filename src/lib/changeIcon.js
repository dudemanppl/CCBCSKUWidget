chrome.runtime.onMessage.addListener(function (
  { onCompetitiveCyclist },
  { tab: { id: tabId } }
) {
  chrome.pageAction.show(tabId);
  if (!onCompetitiveCyclist) {
    chrome.pageAction.setIcon({ path: "../../images/bc.png", tabId });
  }
});
