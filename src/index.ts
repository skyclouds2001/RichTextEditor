class TextEditor {
  static #editor_id = 0

  #id = ++TextEditor.#editor_id

  #app: HTMLElement

  #container: HTMLIFrameElement

  #controller: HTMLDivElement

  #editor: HTMLDivElement

  constructor(app: HTMLElement) {
    this.#app = app

    this.#container = this.#initContainer()
    this.#controller = this.#initController()
    this.#editor = this.#initEditor()
  }

  #initContainer() {
    const container = document.createElement('iframe')

    container.id = `container-${this.#id}`

    container.style.margin = '0'
    container.style.padding = '0'
    container.style.boxSizing = 'border-box'

    container.style.width = '100%'
    container.style.minWidth = '600px'
    container.style.height = '100%'
    container.style.minHeight = '400px'

    this.#app.appendChild(container)

    container.contentDocument!.body.style.margin = '0'
    container.contentDocument!.body.style.padding = '0'
    container.contentDocument!.body.style.boxSizing = 'border-box'

    return container
  }

  #initController() {
    const controller = document.createElement('div')

    controller.id = `controller-${this.#id}`

    controller.style.margin = '0'
    controller.style.padding = '10px'
    controller.style.boxSizing = 'border-box'

    controller.style.width = '100%'
    controller.style.height = '10%'

    controller.innerHTML = '<button onclick="document.execCommand(\'bold\')">B</button>'

    this.#container.contentDocument!.body.appendChild(controller)

    return controller
  }

  #initEditor() {
    const editor = document.createElement('div')

    editor.id = `editor-${this.#id}`
    editor.contentEditable = 'true'

    editor.style.margin = '0'
    editor.style.padding = '10px'
    editor.style.boxSizing = 'border-box'

    editor.style.width = '100%'
    editor.style.height = '90%'

    editor.style.borderTop = '1px solid #ccc'
    editor.style.outline = 'none'

    this.#container.contentDocument!.body.appendChild(editor)

    return editor
  }
}
