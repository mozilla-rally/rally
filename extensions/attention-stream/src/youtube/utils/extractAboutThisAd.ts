const extractAboutThisAd = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let targetingReasons, advertiserInfo;

  // Targeting attributes
  const targetingElems = doc.querySelectorAll(".Xkwrgc"); // These generated class names seem to be consistent
  if (targetingElems.length > 0) {
    targetingReasons = [];
    targetingElems.forEach((elem) => {
      targetingReasons.push((elem as HTMLElement).innerText);
    });
  }

  // Advertiser Info
  const advertiserInfoKeys = doc.querySelectorAll(".KHCSwf");
  const advertiserInfoValues = doc.querySelectorAll(".rvkIVc");
  if (
    advertiserInfoKeys.length === advertiserInfoValues.length &&
    advertiserInfoKeys.length > 0
  ) {
    advertiserInfo = {};
    advertiserInfoKeys.forEach((elem, i) => {
      const key = (elem as HTMLElement).innerText;
      const value = (advertiserInfoValues.item(i) as HTMLElement).innerText;
      advertiserInfo[key] = value;
    });
  }

  return {
    targetingReasons,
    advertiserInfo,
  };
};

export default extractAboutThisAd;
