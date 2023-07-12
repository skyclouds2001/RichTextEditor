interface EditorOptions {
  pageWidth: number
  pageHeight: number
  pageMargin: [number, number, number, number]
  pagePadding: [number, number, number, number]
  pageBackgroundColor: string
  pageBorder: string
  pageBorderRadius: number
  pageBoxShadow: string

  indicatorColor: string
  indicatorSize: number

  fontColor: string
  fontSize: number
  fontFamily: string
  lineHeight: number

  cursorWidth: number
  cursorHeight: number
  cursorColor: string
  cursorZIndex: number
  cursorAnimationDuration: number

  referenceLine: boolean
}

interface Word {
  value: string
  style?: Partial<WordStyle>
  info?: WordInfo
  pos?: WordPos
}

interface WordStyle {
  fontColor: string
  fontSize: number
  fontFamily: string
  lineHeight: number
  fontStyle: string
  italic: boolean
  fontWeight: string
  bold: boolean
  backgroundColor: string
  bgColor: string
  underline: boolean
  strikethroungh: boolean
}

interface WordInfo {
  width: number
  height: number
  ascent: number
  descent: number
  font: string
}

interface WordPos {
  top: number
  bottom: number
  left: number
  right: number
  page: number
}

interface Line {
  width: number
  height: number
  lineHeight: number
  ascent: number
  descent: number
  elements: Word[]
  pos?: LinePos
}

interface LinePos {
  top: number
  bottom: number
  page: number
}

interface Page {
  canvas: HTMLCanvasElement
  lines: Line[]
}

/**
 * 编辑器
 */
class Editor {
  /**
   * 编辑器默认选项
   */
  static readonly options: EditorOptions = {
    pageWidth: 595,
    pageHeight: 842,
    pageMargin: [20, 20, 20, 20],
    pagePadding: [75, 75, 75, 75],
    pageBackgroundColor: '#fff',
    pageBorder: 'none',
    pageBorderRadius: 0,
    pageBoxShadow: '#9ea1a566 0 2px 12px',

    indicatorColor: '#bababa',
    indicatorSize: 40,

    fontColor: '#333',
    fontSize: 16,
    fontFamily: 'fangsong system-ui',
    lineHeight: 1.5,

    cursorWidth: 1,
    cursorHeight: 16,
    cursorColor: '#000',
    cursorZIndex: 9999,
    cursorAnimationDuration: 1000,

    referenceLine: false,
  }

  /**
   * 编辑器内置离线canvas
   */
  static #offscreenCanvas: OffscreenCanvas

  /**
   * 编辑器内置离线canvas绘图上下文
   */
  static #offscreenCanvasRenderingContext: OffscreenCanvasRenderingContext2D

  /**
   * 编辑器静态构造函数
   * @param container 容器
   * @param options 选项
   */
  static create(container: HTMLElement, data: Word[] = [], options?: Partial<EditorOptions>) {
    return new Editor(container, data, options)
  }

  /**
   * 静态块 - 初始化离线canvas实例
   */
  static {
    this.#offscreenCanvas = new OffscreenCanvas(this.options.pageWidth, this.options.pageHeight)
    this.#offscreenCanvasRenderingContext = this.#offscreenCanvas.getContext('2d')!
  }

  /**
   * 编辑器构造方法
   * @param container 容器
   * @param options 选项
   */
  constructor(container: HTMLElement, words: Word[] = [], options: Partial<EditorOptions> = {}) {
    this.id = Math.round(Math.random() * 10000)
    this.container = container
    this.options = Object.assign({}, Editor.options, options)
    this.#pages = []
    this.#lines = []
    this.#words = Object.assign(words)
    this.#contexts = new WeakMap()
    this.#cursor = this.#initCursor()

    this.#init()

    this.#render()
  }

  /**
   * 编辑器实例ID
   */
  readonly id: number

  /**
   * 编辑器实例容器
   */
  readonly container: HTMLElement

  /**
   * 编辑器实例选项
   */
  readonly options: EditorOptions

  /**
   * 编辑器页面列表
   */
  readonly #pages: Page[]

  /**
   * 编辑器行列表
   */
  readonly #lines: Line[]

  /**
   * 编辑器文本数据
   */
  readonly #words: Word[]

  /**
   * 编辑器绘图上下文索引
   */
  readonly #contexts: WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>

  /**
   * 编辑器光标实例
   */
  readonly #cursor: HTMLDivElement

  /**
   * 重设编辑器方法
   */
  reset() {
    this.destroy()
    this.#render()
  }

  /**
   * 关闭编辑器方法
   */
  destroy() {
    this.#pages.forEach((page) => {
      this.container.removeChild(page.canvas)
    })
    this.#pages.length = 0
    this.#lines.length = 0
    this.#words.length = 0
  }

  /**
   * 转换像素数值至像素字符串方法
   * @param pixel 像素数值
   * @returns 像素字符串
   */
  #transformPixelNumberToString(pixel: number): string {
    return `${pixel}px`
  }

  /**
   * 将全局下鼠标位置转换为确定的页面实例及相对其的坐标
   * @param x 全局鼠标x位置
   * @param y 全局鼠标y位置
   * @returns 相对页面实例鼠标位置及对应页面实例
   */
  #transformWindowPositionToCanvasPosition(x: number, y: number): [x: number, y: number, instance: HTMLCanvasElement | null] {
    // 点击点在某页之内
    for(const i in this.#pages) {
      const { offsetLeft, offsetTop, width, height } = this.#pages[i].canvas
      if (offsetLeft <= x && x <= offsetLeft + width && offsetTop <= y && y <= offsetTop + height ) {
        return [x - offsetLeft, y - offsetTop, this.#pages[i].canvas]
      }
    }
    // 其他
    return [x, y, null]
  }

  /**
   * 将相对页面实例鼠标位置转换为全局鼠标坐标
   * @param x 相对页面实例鼠标x位置
   * @param y 相对页面实例鼠标y位置
   * @param instance 页面实例
   * @returns 全局鼠标位置
   */
  #transformCanvasPositionToWindowPosition(x: number, y: number, instance: HTMLCanvasElement): [x: number, y: number] {
    const { offsetLeft, offsetTop } = instance
    return [x + offsetLeft, y + offsetTop]
  }

  /**
   * 从canvas数据获取字
   * @param x 相对canvas的x坐标
   * @param y 相对canvas的y坐标
   * @param canvas 当前canvas下标
   * @returns 字
   */
  #getWordPositionFromCanvasPosition(x: number, y: number, canvas: HTMLCanvasElement): [x: number, y: number, word: Word | null, type?: 'word' | 'line' | 'page'] {
    const { pageHeight, pagePadding, pageWidth } = this.options

    // 点击点在某一字之内 
    for(const word of this.#words) {
      if (this.#pages[word!.pos!.page].canvas === canvas && word!.pos!.left <= x && x <= word!.pos!.right && word!.pos!.top <= y && y <= word!.pos!.bottom) {
        return [x, y, word, 'word']
      }
    }

    // 点击点在某一行之内
    for (const line of this.#lines) {
      if (this.#pages[line!.pos!.page].canvas === canvas && line.pos!.top <= y && line.pos!.bottom >= y && pagePadding[3] <= x && x <= pageWidth - pagePadding[1]) {
        return [x, y, line.elements.at(-1)!, 'line']
      }
    }

    // 点击点在某页编辑区域之内
    for (const page of this.#pages) {
      if (page.canvas === canvas && pagePadding[0] <= y && y <= pageHeight - pagePadding[2] && pagePadding[3] <= x && x <= pageWidth - pagePadding[1]) {
        return [x, y, page.lines.at(-1)!.elements.at(-1)!, 'page']
      }
    }
    // 其他
    return [x, y, null]
  }

  /**
   * 生成字体字符串方法
   */
  #generateFontString({
    fontStyle = 'normal',
    fontVariant = 'normal',
    fontWeight = 'normal',
    fontStretch = 'normal',
    fontSize,
    fontFamily,
  }: {
    fontStyle?: string
    fontVariant?: string
    fontWeight?: string
    fontStretch?: string
    fontSize: number
    fontFamily: string
  }): string {
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${this.#transformPixelNumberToString(fontSize)} ${fontFamily}`.trim()
  }

  /**
   * 初始化方法
   */
  #init() {
    Editor.#offscreenCanvas.width = this.options.pageWidth
    Editor.#offscreenCanvas.height = this.options.pageHeight

    document.documentElement.style.margin = '0px'
    document.documentElement.style.padding = '0px'
    document.documentElement.style.boxSizing = 'border-box'

    document.body.style.margin = '0px'
    document.body.style.padding = '0px'
    document.body.style.boxSizing = 'border-box'

    this.container.id = `container-${this.id}`

    this.container.style.display = 'flex'
    this.container.style.flexDirection = 'column'
    this.container.style.justifyContent = 'center'
    this.container.style.alignItems = 'center'
    this.container.style.margin = '0'
    this.container.style.padding = '0'
    this.container.style.boxSizing = 'border-box'
    this.container.style.position = 'relative'
    this.container.style.top = '0'
    this.container.style.bottom = '0'
    this.container.style.left = '0'
    this.container.style.right = '0'

    window.addEventListener('mousedown', this.#onMouseDown.bind(this))
  }

  /**
   * 鼠标落下事件回调 用于跟踪光标位置
   * @param e 鼠标落下事件
   */
  #onMouseDown(e: MouseEvent) {
    const [x, y, page] = this.#transformWindowPositionToCanvasPosition(e.pageX, e.pageY)

    if (!page) {
      this.#cursor.hidden = true
      return
    }

    const [,, word, mode] = this.#getWordPositionFromCanvasPosition(x, y, page)

    if(!word || !mode) {
      this.#cursor.hidden = true
      return
    }

    const pos = this.#generateCursorInfo(word, page)

    this.#moveCursor(pos)
  }

  /**
   * 新建页面方法
   */
  #createPage() {
    const { pageWidth, pageHeight, pageMargin, pagePadding, pageBackgroundColor, pageBorder, pageBorderRadius, pageBoxShadow } = this.options

    const canvas = document.createElement('canvas')

    canvas.id = `page-${this.id}-${this.#pages.length}`
    canvas.width = pageWidth
    canvas.height = pageHeight
    canvas.style.width = this.#transformPixelNumberToString(pageWidth)
    canvas.style.height = this.#transformPixelNumberToString(pageHeight)
    canvas.style.margin = pageMargin.map(this.#transformPixelNumberToString).join(' ')
    canvas.style.padding = pagePadding.map(() => 0).map(this.#transformPixelNumberToString).join(' ')
    canvas.style.boxSizing = 'border-box'
    canvas.style.backgroundColor = pageBackgroundColor
    canvas.style.border = pageBorder
    canvas.style.boxShadow = pageBoxShadow
    canvas.style.borderRadius = this.#transformPixelNumberToString(pageBorderRadius)

    this.container.appendChild(canvas)
    this.#pages.push({
      canvas,
      lines: [],
    })

    const context = canvas.getContext('2d')!
    this.#contexts.set(canvas, context)

    if (this.options.referenceLine) {
      context.save()
      context.beginPath()
      context.strokeStyle = '#0c0'
      context.moveTo(pagePadding[3], pagePadding[0])
      context.lineTo(pageWidth - pagePadding[1], pagePadding[0])
      context.lineTo(pageWidth - pagePadding[1], pageHeight - pagePadding[2])
      context.lineTo(pagePadding[3], pageHeight - pagePadding[2])
      context.lineTo(pagePadding[3], pagePadding[0])
      context.stroke()
      context.restore()
    }
  }

  /**
   * 计算字尺寸信息
   * @param word 字
   */
  #measureWord(word: Word): Readonly<WordInfo> {
    const { fontSize, fontFamily } = this.options

    const font = this.#generateFontString({
      fontSize: word.style?.fontSize ?? fontSize,
      fontFamily: word.style?.fontFamily ?? fontFamily,
      fontStyle: word.style?.italic ? 'italic' : word.style?.fontStyle,
      fontWeight: word.style?.bold ? 'bold' : word.style?.fontWeight,
    })

    Editor.#offscreenCanvasRenderingContext.font = font

    const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = Editor.#offscreenCanvasRenderingContext.measureText(word.value)

    return {
      width,
      height: actualBoundingBoxAscent + actualBoundingBoxDescent,
      ascent: actualBoundingBoxAscent,
      descent: actualBoundingBoxDescent,
      font,
    }
  }

  /**
   * 计算字组信息
   */
  #measureLine() {
    const { lineHeight, pageWidth, pagePadding } = this.options

    const contentWidth = pageWidth - pagePadding[1] - pagePadding[3]

    this.#lines.push({
      width: 0,
      height: 0,
      lineHeight: 0,
      ascent: 0,
      descent: 0,
      elements: [],
    })

    this.#words.forEach((word) => {
      const info = this.#measureWord(word) satisfies WordInfo
      word.info = info

      const line = this.#lines.at(-1)!

      if (info.width + line.width > contentWidth || word.value === '\n') {
        this.#lines.push({
          width: 0,
          height: 0,
          lineHeight: 0,
          ascent: 0,
          descent: 0,
          elements: [],
        })
      }

      line.width += info.width
      line.height = Math.max(line.height, info.height)
      line.lineHeight = Math.max(line.lineHeight, info.height * (word.style?.lineHeight ?? lineHeight))
      line.ascent = Math.max(line.ascent, info.ascent)
      line.descent = Math.max(line.descent, info.descent)
      line.elements.push(word)
    })
  }

  /**
   * 绘制直角器
   * @param context canvas绘图上下文
   */
  #renderIndicator(context: CanvasRenderingContext2D) {
    const { pageWidth, pageHeight, pagePadding, indicatorColor, indicatorSize } = this.options

    context.save()
    context.beginPath()

    context.strokeStyle = indicatorColor

    const leftTop = new Path2D()
    leftTop.moveTo(pagePadding[3] - indicatorSize, pagePadding[0])
    leftTop.lineTo(pagePadding[3], pagePadding[0])
    leftTop.lineTo(pagePadding[3], pagePadding[0] - indicatorSize)

    const rightTop = new Path2D()
    rightTop.moveTo(pageWidth - pagePadding[1] + indicatorSize, pagePadding[0])
    rightTop.lineTo(pageWidth - pagePadding[1], pagePadding[0])
    rightTop.lineTo(pageWidth - pagePadding[1], pagePadding[0] - indicatorSize)

    const rightBottom = new Path2D()
    rightBottom.moveTo(pageWidth - pagePadding[1] + indicatorSize, pageHeight - pagePadding[2])
    rightBottom.lineTo(pageWidth - pagePadding[1], pageHeight - pagePadding[2])
    rightBottom.lineTo(pageWidth - pagePadding[1], pageHeight - pagePadding[2] + indicatorSize)

    const leftBottom = new Path2D()
    leftBottom.moveTo(pagePadding[3] - indicatorSize, pageHeight - pagePadding[2])
    leftBottom.lineTo(pagePadding[3], pageHeight - pagePadding[2])
    leftBottom.lineTo(pagePadding[3], pageHeight - pagePadding[2] + indicatorSize)

    context.stroke(leftTop)
    context.stroke(rightTop)
    context.stroke(rightBottom)
    context.stroke(leftBottom)

    context.restore()
  }

  /**
   * 渲染行方法
   */
  #renderLine(line: Line, context: CanvasRenderingContext2D, renderHeight: number) {
    const { pageBackgroundColor, fontColor, pagePadding } = this.options

    let renderWidth = 0

    line.elements.forEach((word, i) => {
      if (word.style?.bgColor || word.style?.backgroundColor) {
        context.save()
        context.beginPath()

        context.fillStyle = word.style.backgroundColor || word.style.bgColor || pageBackgroundColor
        context.fillRect(renderWidth + pagePadding[3], renderHeight + pagePadding[0], word.info!.width, line.lineHeight)

        context.restore()
      }

      if (word.style?.underline) {
        context.save()
        context.beginPath()

        context.strokeStyle = word.style?.fontColor ?? fontColor
        const path = new Path2D()
        path.moveTo(renderWidth + pagePadding[3], renderHeight + pagePadding[0] + line.lineHeight - (line.lineHeight - line.height) / 2 + line.descent)
        path.lineTo(renderWidth + pagePadding[3] + word.info!.width, renderHeight + pagePadding[0] + line.lineHeight - (line.lineHeight - line.height) / 2 + line.descent)
        context.stroke(path)

        context.restore()
      }

      if (word.style?.strikethroungh) {
        context.save()
        context.beginPath()

        context.strokeStyle = word.style?.fontColor ?? fontColor
        const path = new Path2D()
        path.moveTo(renderWidth + pagePadding[3], renderHeight + pagePadding[0] + line.lineHeight / 2)
        path.lineTo(renderWidth + pagePadding[3] + word.info!.width, renderHeight + pagePadding[0] + line.lineHeight / 2)
        context.stroke(path)

        context.restore()
      }

      context.save()
      context.beginPath()

      context.font = word.info!.font
      context.fillStyle = word.style?.fontColor ?? fontColor
      context.fillText(word.value, renderWidth + pagePadding[3], renderHeight + pagePadding[0] + line.lineHeight - (line.lineHeight - line.height) / 2 - line.descent)

      context.restore()

      word.pos = {
        top: renderHeight + pagePadding[0] + (line.lineHeight - word.info!.height) / 2,
        bottom: renderHeight + pagePadding[0] + word.info!.height + (line.lineHeight - word.info!.height) / 2,
        left: renderWidth + pagePadding[3],
        right: renderWidth + pagePadding[3] + word.info!.width,
        page: this.#pages.length - 1,
      } satisfies WordPos

      renderWidth += word.info!.width
    })

    if (this.options.referenceLine) {
      context.save()
      context.beginPath()
      context.strokeStyle = '#a00'
      context.moveTo(pagePadding[3], renderHeight + pagePadding[0] + line.lineHeight)
      context.lineTo(this.options.pageWidth - pagePadding[1], renderHeight + pagePadding[0] + line.lineHeight)
      context.stroke()
      context.restore()
    }
  }

  /**
   * 渲染页面方法
   */
  #renderPage() {
    const { pageHeight, pagePadding } = this.options

    const contentHeight = pageHeight - pagePadding[0] - pagePadding[2]

    let pageIndex = 0
    let renderHeight = 0
    if (!this.#pages[pageIndex]) {
      this.#createPage()
    }

    this.#lines.forEach((line) => {
      if (line.lineHeight + renderHeight > contentHeight) {
        renderHeight = 0
        ++pageIndex
        if (!this.#pages[pageIndex]) {
          this.#createPage()
        }
      }

      const canvas = this.#pages.at(-1)!.canvas
      const context = this.#contexts.get(canvas)!

      this.#renderIndicator(context)

      line.pos = {
        top: renderHeight + pagePadding[0],
        bottom: renderHeight + line.lineHeight + pagePadding[0],
        page: this.#pages.length - 1,
      } satisfies LinePos

      this.#renderLine(line, context, renderHeight)

      this.#pages[pageIndex].lines.push(line)

      renderHeight += line.lineHeight
    })
  }

  /**
   * 渲染控制主方法
   */
  #render() {
    this.#measureLine()
    this.#renderPage()
  }

  /**
   * 初始化光标实例方法
   * @returns 光标
   */
  #initCursor(): HTMLDivElement {
    const { cursorColor, cursorWidth, cursorHeight, cursorZIndex, cursorAnimationDuration } = this.options

    const cursor = document.createElement('div')

    cursor.hidden = true

    cursor.style.position = 'absolute'
    cursor.style.left = '0'
    cursor.style.top = '0'
    cursor.style.width = this.#transformPixelNumberToString(cursorWidth)
    cursor.style.height = this.#transformPixelNumberToString(cursorHeight * 1.5)
    cursor.style.backgroundColor = cursorColor
    cursor.style.zIndex = cursorZIndex.toString()

    cursor.animate({
      opacity: [0, 0, 1, 1],
      offset: [0, 0.5, 0.5, 1],
    }, {
      duration: cursorAnimationDuration,
      iterations: Infinity,
    })

    this.container.appendChild(cursor)

    return cursor
  }

  /**
   * 生成光标信息
   * @param word 字位置
   * @returns 光标信息
   */
  #generateCursorInfo(word: Word, page: HTMLCanvasElement): Record<'top' | 'left' | 'width' | 'height', number> {
    const { fontSize } = this.options

    const width = 1
    const height = Math.max(word.info!.height, fontSize) * 1.5

    const [left, top] = this.#transformCanvasPositionToWindowPosition(word.pos!.right, word.pos!.top - height / 6, page)

    return {
      top,
      left,
      width,
      height,
    }
  }

  /**
   * 移动光标
   */
  #moveCursor(pos: Record<'top' | 'left' | 'width' | 'height', number>) {
    this.#cursor.hidden = false

    this.#cursor.style.top = this.#transformPixelNumberToString(pos.top)
    this.#cursor.style.left = this.#transformPixelNumberToString(pos.left)
    this.#cursor.style.width = this.#transformPixelNumberToString(pos.width)
    this.#cursor.style.height = this.#transformPixelNumberToString(pos.height)
  }
}
