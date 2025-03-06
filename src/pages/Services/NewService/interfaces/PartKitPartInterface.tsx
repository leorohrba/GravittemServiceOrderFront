interface IPartKitPart {
  partKitPartId: number
  partKitId: number
  partId: number
  partCode: string
  partDescription: string
  measuringUnitId: number
  measuringUnitCode: string
  materialLikeCount: number
  stockLocationId: number
  stockLocationDescription: string
  quantity: number
  returnRequired: boolean
  canDecimal: boolean
  priceListId: number
  priceListDescription: string
  priceListItemId: number
  unitValue: number
  quantityAvailable: number
}
