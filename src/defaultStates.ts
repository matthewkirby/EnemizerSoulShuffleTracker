import allRoomSetupsList from './roomSetupList.json';

export type OverworldStateType = { [key:string]: string[]};
export type DungeonStateType = { [key:string]: { [key:string]: string[] } };


const defaultOverworldState: OverworldStateType = {};
const defaultDungeonState: DungeonStateType = {};

for (const [name, details] of Object.entries(allRoomSetupsList)) {
  if (!details.scene) {
    defaultOverworldState[name] = []
  } else {
    defaultDungeonState[name] = {};
    for (const roomName of details.rooms) {
      defaultDungeonState[name][roomName] = [];
    }
  }
};

export const defaultFoundSoulsString = JSON.stringify([]);
export const defaultOverworldStateString = JSON.stringify(defaultOverworldState);
export const defaultDungeonStateString = JSON.stringify(defaultDungeonState);