export default function getImg(name: string, size: number): string {
  // FIXME hack for Mag'har icons, oops
  name = name.replace(/'/g, '')
  return `<img src="https://img.wowthing.org/${size}/${name}.png" width="${size}" height="${size}"}>`
}
