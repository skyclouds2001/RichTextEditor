class TextEditor {
  static #editor_id: number = 0

  static readonly controllers: Record<'name' | 'icon' | 'cmd', string>[] = [
    {
      name: 'material-symbols:format-bold-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M8.8 19q-.825 0-1.413-.588T6.8 17V7q0-.825.588-1.413T8.8 5h3.525q1.625 0 3 1T16.7 8.775q0 1.275-.575 1.963t-1.075.987q.625.275 1.388 1.025T17.2 15q0 2.225-1.625 3.113t-3.05.887H8.8Zm1.025-2.8h2.6q1.2 0 1.463-.613t.262-.887q0-.275-.263-.887T12.35 13.2H9.825v3Zm0-5.7h2.325q.825 0 1.2-.425t.375-.95q0-.6-.425-.975t-1.1-.375H9.825V10.5Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'bold',
    },
    {
      name: 'material-symbols:format-italic-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M6.25 19q-.525 0-.888-.363T5 17.75q0-.525.363-.888t.887-.362H9l3-9H9.25q-.525 0-.888-.363T8 6.25q0-.525.363-.888T9.25 5h7.5q.525 0 .888.363T18 6.25q0 .525-.363.888t-.887.362H14.5l-3 9h2.25q.525 0 .888.363t.362.887q0 .525-.363.888T13.75 19h-7.5Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'italic',
    },
  ]

  readonly #id: number

  readonly #app: HTMLElement

  readonly #container: HTMLIFrameElement

  readonly #controller: HTMLDivElement

  readonly #editor: HTMLDivElement

  constructor(app: HTMLElement) {
    this.#id = ++TextEditor.#editor_id
    this.#app = app

    this.#container = this.#createContainer()
    this.#controller = this.#createController()
    this.#editor = this.#createEditor()
  }

  #createContainer() {
    const container = document.createElement('iframe')

    container.id = `container-${this.#id}`

    container.style.margin = '0'
    container.style.padding = '0'
    container.style.boxSizing = 'border-box'

    container.style.width = '100%'
    container.style.minWidth = '600px'
    container.style.height = '100%'
    container.style.minHeight = '400px'

    container.style.border = 'none'

    this.#app.appendChild(container)

    const style = document.createElement('style')

    style.id = `container-style-${this.#id}`

    container.contentDocument?.head.appendChild(style)

    container.contentDocument!.body.style.margin = '0'
    container.contentDocument!.body.style.padding = '0'
    container.contentDocument!.body.style.boxSizing = 'border-box'

    return container
  }

  #createController() {
    const controller = document.createElement('div')

    controller.id = `controller-${this.#id}`

    controller.addEventListener('click', this.#handleControl.bind(this))

    this.#container.contentDocument?.styleSheets.item(0)?.insertRule(`
      #controller-${this.#id} {
        margin: 0;
        padding: 5px 2.5px;
        box-sizing: border-box;
  
        width: 100%;
        height: 37px;
  
        display: flex;
        justify-content: flex-start;
        align-items: center;
  
        border: 1px solid #ccc;
        border-bottom: 0;
      }
    `)

    TextEditor.controllers.forEach((v) => {
      const button = document.createElement('button')

      button.id = `controller-button-${v.cmd}`

      button.setAttribute('data-icon', v.name)
      button.setAttribute('data-cmd', v.cmd)

      this.#container.contentDocument?.styleSheets.item(0)?.insertRule(`
        #controller-button-${v.cmd} {
          margin: 0 2.5px;
          padding: 2px;
          box-sizing: border-box;

          width: 26px;
          height: 26px;
  
          border: none;
          border-radius: 5px;
          background-color: transparent;
          background-image: ${v.icon};
          background-clip: border-box;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;

          transition: all ease-in-out 500ms 0;

          &:hover {
            background-color: #eee;
          }
        }
      `)

      controller.appendChild(button)
    })

    this.#container.contentDocument!.body.appendChild(controller)

    return controller
  }

  #createEditor() {
    const editor = document.createElement('div')

    editor.id = `editor-${this.#id}`
    editor.contentEditable = 'true'

    this.#container.contentDocument?.styleSheets.item(0)?.insertRule(`
      #editor-${this.#id} {
        margin: 0;
        padding: 10px;
        box-sizing: border-box;
  
        width: 100%;
        height: calc(100% - 37px);
  
        border: 1px solid #ccc;
        background-color: transparent;
        outline: none;

        overflow: hidden auto;

        &::-webkit-scrollbar {
          width: 5px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 2.5px;
          cursor: pointer;
        }

        &::-webkit-scrollbar-track {
          background-color: #eee;
        }
      }
    `)

    this.#container.contentDocument!.body.appendChild(editor)

    return editor
  }

  #handleControl(e: MouseEvent) {
    if (e.target instanceof HTMLButtonElement) {
      const { cmd } = e.target.dataset
      switch (cmd) {
        case 'bold':
          this.#container.contentDocument!.execCommand('bold')
          break
        case 'italic':
          this.#container.contentDocument!.execCommand('italic')
          break
      }
    }
  }
}
