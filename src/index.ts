interface Controller {
  name: string
  icon: string
  cmd: string
}

class TextEditor {
  static #editor_id: number = 0

  static readonly controllers: Controller[] = [
    {
      name: 'material-symbols:undo-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M8 19q-.425 0-.713-.288T7 18q0-.425.288-.713T8 17h6.1q1.575 0 2.738-1T18 13.5q0-1.5-1.163-2.5T14.1 10H7.8l1.9 1.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275L4.7 9.7q-.15-.15-.213-.325T4.425 9q0-.2.063-.375T4.7 8.3l3.6-3.6q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L7.8 8h6.3q2.425 0 4.163 1.575T20 13.5q0 2.35-1.738 3.925T14.1 19H8Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'undo',
    },
    {
      name: 'material-symbols:redo-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M16.2 10H9.9q-1.575 0-2.738 1T6 13.5Q6 15 7.163 16T9.9 17H16q.425 0 .713.288T17 18q0 .425-.288.713T16 19H9.9q-2.425 0-4.163-1.575T4 13.5q0-2.35 1.738-3.925T9.9 8h6.3l-1.9-1.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.6 3.6q.15.15.213.325t.062.375q0 .2-.063.375T19.3 9.7l-3.6 3.6q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l1.9-1.9Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'redo',
    },
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
    {
      name: 'material-symbols:superscript-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M20 9q-.425 0-.713-.288T19 8V7q0-.425.288-.713T20 6h2V5h-2.5q-.2 0-.35-.15T19 4.5q0-.2.15-.35T19.5 4H22q.425 0 .713.288T23 5v1q0 .425-.288.713T22 7h-2v1h2.5q.2 0 .35.15t.15.35q0 .2-.15.35T22.5 9H20ZM7.925 20q-.675 0-.987-.575t.037-1.15l3.525-5.55l-3.2-5q-.35-.575-.038-1.15T8.226 6q.3 0 .55.138t.4.387L11.95 11h.1l2.75-4.475q.15-.275.363-.4T15.75 6q.675 0 .975.575t-.05 1.15l-3.2 5l3.55 5.525q.35.575.025 1.163t-.975.587q-.3 0-.55-.138t-.4-.387l-3.075-4.9h-.1l-3.075 4.9q-.175.275-.375.4T7.925 20Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'superscript',
    },
    {
      name: 'material-symbols:subscript-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M20 20q-.425 0-.713-.288T19 19v-1q0-.425.288-.713T20 17h2v-1h-2.5q-.2 0-.35-.15T19 15.5q0-.2.15-.35t.35-.15H22q.425 0 .713.288T23 16v1q0 .425-.288.713T22 18h-2v1h2.5q.2 0 .35.15t.15.35q0 .2-.15.35t-.35.15H20Zm-9.5-9.275l-3.2-5q-.35-.575-.037-1.15T8.225 4q.3 0 .55.138t.4.387L11.95 9h.1l2.75-4.475q.15-.275.4-.4T15.75 4q.675 0 .975.575t-.05 1.15l-3.2 5l3.55 5.525q.35.575.025 1.163t-.975.587q-.3 0-.55-.138t-.4-.387l-3.075-4.9h-.1l-3.075 4.9q-.175.275-.413.4T7.926 18q-.675 0-.987-.575t.037-1.15l3.525-5.55Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'subscript',
    },
    {
      name: 'material-symbols:link-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M7 17q-2.075 0-3.538-1.463T2 12q0-2.075 1.463-3.538T7 7h3q.425 0 .713.288T11 8q0 .425-.288.713T10 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h3q.425 0 .713.288T11 16q0 .425-.288.713T10 17H7Zm2-4q-.425 0-.713-.288T8 12q0-.425.288-.713T9 11h6q.425 0 .713.288T16 12q0 .425-.288.713T15 13H9Zm5 4q-.425 0-.713-.288T13 16q0-.425.288-.713T14 15h3q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-3q-.425 0-.713-.288T13 8q0-.425.288-.713T14 7h3q2.075 0 3.538 1.463T22 12q0 2.075-1.463 3.538T17 17h-3Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'createLink',
    },
    {
      name: 'material-symbols:link-off-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="m19.25 16.45l-1.5-1.55q1-.275 1.625-1.063T20 12q0-1.25-.875-2.125T17 9h-3q-.425 0-.713-.288T13 8q0-.425.288-.713T14 7h3q2.075 0 3.538 1.463T22 12q0 1.425-.738 2.625T19.25 16.45Zm-3.625-3.675L13.85 11H15q.425 0 .713.288T16 12q0 .25-.1.45t-.275.325ZM20.5 21.9q-.275.275-.7.275t-.7-.275l-17-17q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l17 17q.275.275.275.7t-.275.7ZM7 17q-2.075 0-3.538-1.463T2 12q0-1.725 1.05-3.075t2.7-1.775L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h3q.425 0 .713.288T11 16q0 .425-.288.713T10 17H7Zm2-4q-.425 0-.713-.288T8 12q0-.425.288-.713T9 11h.625l1.975 2H9Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'unlink',
    },
  ]

  readonly isEditor: boolean

  readonly id: number

  readonly #app: HTMLElement

  readonly #container: HTMLIFrameElement

  readonly #controller: HTMLDivElement

  readonly #editor: HTMLDivElement

  constructor(app: HTMLElement) {
    this.isEditor = true
    this.id = ++TextEditor.#editor_id
    this.#app = app

    this.#container = this.#createContainer()
    this.#controller = this.#createController()
    this.#editor = this.#createEditor()
  }

  #createContainer() {
    const container = document.createElement('iframe')

    container.id = `container-${this.id}`

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

    style.id = `container-style-${this.id}`

    container.contentDocument?.head.appendChild(style)

    container.contentDocument!.body.style.margin = '0'
    container.contentDocument!.body.style.padding = '0'
    container.contentDocument!.body.style.boxSizing = 'border-box'

    return container
  }

  #createController() {
    const controller = document.createElement('div')

    controller.id = `controller-${this.id}`

    controller.addEventListener('click', this.#handleControl.bind(this))

    this.#container.contentDocument?.styleSheets.item(0)?.insertRule(`
      #controller-${this.id} {
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

    editor.id = `editor-${this.id}`
    editor.contentEditable = 'true'

    this.#container.contentDocument?.styleSheets.item(0)?.insertRule(`
      #editor-${this.id} {
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
        case 'undo':
          this.#container.contentDocument!.execCommand('undo')
          break
        case 'redo':
          this.#container.contentDocument!.execCommand('redo')
          break
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
        case 'superscript':
          this.#container.contentDocument!.execCommand('superscript')
          break
        case 'subscript':
          this.#container.contentDocument!.execCommand('subscript')
          break
        case 'createLink':
          const link = window.prompt('Please input the link')
          if (!link) return
          this.#container.contentDocument!.execCommand('createLink', false, link)
          break
        case 'unlink':
          this.#container.contentDocument!.execCommand('unlink')
          break
      }
    }
  }
}
