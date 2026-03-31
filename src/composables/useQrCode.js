export function useQrCode(assetCode = '') {
  return {
    value: assetCode,
    imageUrl: assetCode ? `/qr/${assetCode}.png` : '',
  }
}
