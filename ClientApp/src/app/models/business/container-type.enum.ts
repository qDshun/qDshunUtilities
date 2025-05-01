
/*
Stage - main container holding everything togeher, tree root
BoardContainer - Container holding shadows
MapContainer (Map layer) - One per map. Contains clipping mask, tiles, background color. Should contain only things that could not be directly changed by player
Background layer - One per map. Contains background stuff, that could be edited only by GM, but visible to everyone, like background image on sprites.
Hidden layer - One per map. Contains GM-only visible stuff.
Interactive layer - One per map. Contains player-visible stuff.
*/

export enum ContainerType {
  Map = 'Map-layer-',
  Background = 'Background-layer-',
  Hidden = 'Hidden-layer-',
  Interactable = 'Interactable-layer-',
  Token = 'Token-'
}
