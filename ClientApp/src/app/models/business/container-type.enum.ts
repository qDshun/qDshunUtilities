
/*
Stage - main container holding everything togeher, tree root
BoardContainer - Container holding shadows
BackgroundColor Container  - One per map. Contains background color
Grid Container- One per map. Contains tiles
Background layer - One per map. Contains background stuff, that could be edited only by GM, but visible to everyone, like background image on sprites.
GM layer - One per map. Contains GM-only visible stuff.
Interactive layer - One per map. Contains player-visible stuff.
*/

/*
From the lowest z-index to highest for stuff that users see
0. Board
1. Background color
2. Background layer renderable objects (with local z-indexes)
3. GM layer renderable objects (with local z-indexes)
4. Tile grid
5. Interactable layer renderable objects for default settings, or "Currently selected layer (one of Background | Hidden | Interactable)"
Since one layer should be selected at any time as "Currently selected layer", it should be enough
*/

export enum SubsystemRootContainerType {
  BackgroundColorContainer = 'Background-color-container-',
  GridContainer = 'Grid-container-',
  BackgroundLayerContainer = 'Background-layer-container-',
  GMLayerContainer = 'GM-layer-',
  InteractableLayerContainer = 'Interactable-layer-',
}
