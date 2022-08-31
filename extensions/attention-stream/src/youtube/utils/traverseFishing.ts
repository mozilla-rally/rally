const traverse = (jsonObject, shouldDelete, returnFirst, keys) => {
  let results = [];

  const traverseHelper = (jsonObject) => {
    for (var key in jsonObject) {
      if (keys.includes(key)) {
        if (shouldDelete) {
          delete jsonObject[key];
        } else {
          results.push(jsonObject[key]);
        }

        if (returnFirst) {
          break;
        }
      }
      if (jsonObject[key] !== null && typeof jsonObject[key] == "object") {
        // Recurse
        traverseHelper(jsonObject[key]);
      }
    }
  };

  traverseHelper(jsonObject);
  return results;
};

const fishFor = (key, jsonObject) => {
  return [traverse(jsonObject, false, true, [key])];
};

const fishForAll = (keys, jsonObject) => {
  return traverse(jsonObject, false, false, keys);
};

const fishForAndDelete = (key, jsonObject) => {
  traverse(jsonObject, true, true, [key]);
};

const fishForAndDeleteAll = (keys, jsonObject) => {
  traverse(jsonObject, true, false, keys);
};

export { fishFor, fishForAll, fishForAndDelete, fishForAndDeleteAll };
