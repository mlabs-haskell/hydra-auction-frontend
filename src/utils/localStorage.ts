export const getLocalStorageItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error(`Error retrieveing key: ${key} from local storage`, e);
  }
};

export const setLocalStorageItem = (key: string, value: any) => {
  try {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  } catch (e) {
    console.error(`Error setting key: ${key} to local storage`, e);
  }
};
