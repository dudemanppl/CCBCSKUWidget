if (onPDP) {
  if (onCompetitiveCyclist) invokeFuncInWindow(addOOSAlertToCCPDP);

  PDPTargetLocation(siteInfo).append(
    WMSLink(PDPProductID(), siteInfo),
    copySKUButton(siteInfo)
  );
}

if (onPLP) {
  addAllPLPWidgets(siteInfo);

  /** Watches for changes on SPA to rerender PLP widgets */
  new MutationObserver(() => addAllPLPWidgets(siteInfo)).observe(
    nodeToObservePLP(),
    {
      childList: true,
    }
  );
}
