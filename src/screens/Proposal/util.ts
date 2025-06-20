export type HTMLBlock =
  | {type: 'html'; content: string}
  | {type: 'images'; srcs: string[]}

export default function parserHTMLFile(htmlContent: string): HTMLBlock[] {
  const lines = htmlContent.split('\n')
  return lines.map(line => {
    // get multiple imgs src link
    if (line.startsWith('<div') && line.includes('<img')) {
      const imgSrcs = line.match(/src="([^"]+)"/g)
      const list = imgSrcs!.map(src => src.replace(/src="([^"]+)"/, '$1'))
      return {
        type: 'images',
        srcs: list,
      }
    }
    return {type: 'html', content: line}
  })
}
