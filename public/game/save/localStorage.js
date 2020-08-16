export const saveToLocalStorage = (slot, localPlayer) => {
  localStorage[`NAO${slot}`] = JSON.stringify(localPlayer.data);
};

export const loadFromLocalStorage = (slot) => {
  return JSON.parse(localStorage[`NAO${slot}`]);
};
