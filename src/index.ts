interface Controller {
  name: string
  icon: string
  cmd: string
}

class TextEditor {
  static #editor_id: number = 0

  static readonly controllers: Controller[] = [
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
    {
      name: 'material-symbols:format-underlined-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M6 21q-.425 0-.713-.288T5 20q0-.425.288-.713T6 19h12q.425 0 .713.288T19 20q0 .425-.288.713T18 21H6Zm6-4q-2.525 0-3.925-1.575t-1.4-4.175V4.275q0-.525.388-.9T7.975 3q.525 0 .9.375t.375.9V11.4q0 1.4.7 2.275t2.05.875q1.35 0 2.05-.875t.7-2.275V4.275q0-.525.388-.9T16.05 3q.525 0 .9.375t.375.9v6.975q0 2.6-1.4 4.175T12 17Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'underline',
    },
    {
      name: 'material-symbols:strikethrough-s-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M12.15 20q-1.625 0-2.925-.813t-2.1-2.287q-.225-.425-.05-.9t.675-.675q.425-.2.863-.025t.712.625q.45.75 1.188 1.213t1.687.462q1.05 0 1.9-.5t.85-1.6q0-.45-.175-.825T14.3 14h2.8q.125.35.188.713t.062.787q0 2.15-1.538 3.325T12.15 20ZM3 12q-.425 0-.713-.288T2 11q0-.425.288-.713T3 10h18q.425 0 .713.288T22 11q0 .425-.288.713T21 12H3Zm4.25-4q.05-1.725 1.363-2.938T12.05 3.85q1.35 0 2.425.537t1.8 1.663q.275.425.1.9t-.675.7q-.375.175-.812.038t-.788-.563q-.325-.375-.825-.625T12.1 6.25q-1.025 0-1.7.463T9.65 8h-2.4Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'strikeThrough',
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
        case 'underline':
          this.#container.contentDocument!.execCommand('underline')
          break
        case 'strikeThrough':
          this.#container.contentDocument!.execCommand('strikeThrough')
          break
      }
    }
  }
}
