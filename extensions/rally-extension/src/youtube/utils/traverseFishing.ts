/*
 * Recrusive tree traversal of JSON object:
 * Returns or deletes one or multiple keys
 * depending on parameters
 */
const traverse = (
  jsonObject,
  shouldDelete,
  returnFirst,
  keys,
  keepKeys = false
) => {
  let results = [];

  const traverseHelper = (jsonObject) => {
    for (var key in jsonObject) {
      if (keys.includes(key)) {
        if (shouldDelete) {
          delete jsonObject[key];
        } else {
          if (keepKeys) {
            results.push([key, jsonObject[key]]);
          } else {
            results.push(jsonObject[key]);
          }
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
  const [result] = traverse(jsonObject, false, true, [key]);
  return result;
};

const fishForAll = (keys, jsonObject, keepKeys = false) => {
  return traverse(jsonObject, false, false, keys, keepKeys);
};

const fishForAndDelete = (key, jsonObject) => {
  traverse(jsonObject, true, true, [key]);
};

const fishForAndDeleteAll = (keys, jsonObject) => {
  traverse(jsonObject, true, false, keys);
};

export { fishFor, fishForAll, fishForAndDelete, fishForAndDeleteAll };
