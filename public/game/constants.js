import mapInfo from "../../assets/maps/main.js";

export const mapWidth = mapInfo.width,
  mapHeight = mapInfo.height,
  tileSize = mapInfo.tileheight,
  tilesetColumns = mapInfo.tilesets[0].columns,
  layers = mapInfo.layers,
  canvasTileCount = 19,
  groundLayer = layers[0].data,
  blockingLayer = layers[1].data,
  entitiesLayer = layers[2].data,
  halfOfTileCount = Math.floor(canvasTileCount / 2),
  screenSize = canvasTileCount * tileSize;
