interface Controller {
  name: string
  icon: string
  cmd: string
}

class TextEditor {
  static #editor_id: number = 0

  static readonly controllers: Controller[] = [
    {
      name: 'material-symbols:format-clear-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="m13.2 10.35l-2.325-2.325L7.85 5H18.5q.625 0 1.063.438T20 6.5q0 .625-.438 1.063T18.5 8h-4.3l-1 2.35Zm5.9 11.55l-7.6-7.6l-1.6 3.775q-.175.425-.563.675T8.5 19q-.8 0-1.25-.675T7.125 16.9L9.2 12L2.1 4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l17 17q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'removeFormat',
    },
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
      name: 'material-symbols:format-paragraph-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M10 20q-.425 0-.713-.288T9 19v-5q-2.075 0-3.538-1.463T4 9q0-2.075 1.463-3.538T9 4h8q.425 0 .713.288T18 5q0 .425-.288.713T17 6h-1v13q0 .425-.288.713T15 20q-.425 0-.713-.288T14 19V6h-3v13q0 .425-.288.713T10 20Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'insertParagraph',
    },
    {
      name: 'material-symbols:format-h1-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M6 17q-.425 0-.713-.288T5 16V8q0-.425.288-.713T6 7q.425 0 .713.288T7 8v3h4V8q0-.425.288-.713T12 7q.425 0 .713.288T13 8v8q0 .425-.288.713T12 17q-.425 0-.713-.288T11 16v-3H7v3q0 .425-.288.713T6 17Zm12 0q-.425 0-.713-.288T17 16V9h-1q-.425 0-.713-.288T15 8q0-.425.288-.713T16 7h2q.425 0 .713.288T19 8v8q0 .425-.288.713T18 17Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'heading-1',
    },
    {
      name: 'material-symbols:format-h2-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M4 17q-.425 0-.713-.288T3 16V8q0-.425.288-.713T4 7q.425 0 .713.288T5 8v3h4V8q0-.425.288-.713T10 7q.425 0 .713.288T11 8v8q0 .425-.288.713T10 17q-.425 0-.713-.288T9 16v-3H5v3q0 .425-.288.713T4 17Zm10 0q-.425 0-.713-.288T13 16v-3q0-.825.588-1.413T15 11h4V9h-5q-.425 0-.713-.288T13 8q0-.425.288-.713T14 7h5q.825 0 1.413.588T21 9v2q0 .825-.588 1.413T19 13h-4v2h5q.425 0 .713.288T21 16q0 .425-.288.713T20 17h-6Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'heading-2',
    },
    {
      name: 'material-symbols:format-h3-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M4 17q-.425 0-.713-.288T3 16V8q0-.425.288-.713T4 7q.425 0 .713.288T5 8v3h4V8q0-.425.288-.713T10 7q.425 0 .713.288T11 8v8q0 .425-.288.713T10 17q-.425 0-.713-.288T9 16v-3H5v3q0 .425-.288.713T4 17Zm10 0q-.425 0-.713-.288T13 16q0-.425.288-.713T14 15h5v-2h-3q-.425 0-.713-.288T15 12q0-.425.288-.713T16 11h3V9h-5q-.425 0-.713-.288T13 8q0-.425.288-.713T14 7h5q.825 0 1.413.588T21 9v6q0 .825-.588 1.413T19 17h-5Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'heading-3',
    },
    {
      name: 'material-symbols:format-h4-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M3.5 17q-.425 0-.713-.288T2.5 16V8q0-.425.288-.713T3.5 7q.425 0 .713.288T4.5 8v3h4V8q0-.425.288-.713T9.5 7q.425 0 .713.288T10.5 8v8q0 .425-.288.713T9.5 17q-.425 0-.713-.288T8.5 16v-3h-4v3q0 .425-.288.713T3.5 17Zm15 0q-.425 0-.713-.288T17.5 16v-2h-4q-.425 0-.713-.288T12.5 13V8q0-.425.288-.713T13.5 7q.425 0 .713.288T14.5 8v4h3V8q0-.425.288-.713T18.5 7q.425 0 .713.288T19.5 8v4h1q.425 0 .713.288T21.5 13q0 .425-.288.713T20.5 14h-1v2q0 .425-.288.713T18.5 17Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'heading-4',
    },
    {
      name: 'material-symbols:format-h5-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M4 17q-.425 0-.713-.288T3 16V8q0-.425.288-.713T4 7q.425 0 .713.288T5 8v3h4V8q0-.425.288-.713T10 7q.425 0 .713.288T11 8v8q0 .425-.288.713T10 17q-.425 0-.713-.288T9 16v-3H5v3q0 .425-.288.713T4 17Zm10 0q-.425 0-.713-.288T13 16q0-.425.288-.713T14 15h5v-2h-5q-.425 0-.713-.288T13 12V8q0-.425.288-.713T14 7h6q.425 0 .713.288T21 8q0 .425-.288.713T20 9h-5v2h4q.825 0 1.413.588T21 13v2q0 .825-.588 1.413T19 17h-5Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'heading-5',
    },
    {
      name: 'material-symbols:format-h6-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M4 17q-.425 0-.713-.288T3 16V8q0-.425.288-.713T4 7q.425 0 .713.288T5 8v3h4V8q0-.425.288-.713T10 7q.425 0 .713.288T11 8v8q0 .425-.288.713T10 17q-.425 0-.713-.288T9 16v-3H5v3q0 .425-.288.713T4 17Zm11 0q-.825 0-1.413-.588T13 15V9q0-.825.588-1.413T15 7h5q.425 0 .713.288T21 8q0 .425-.288.713T20 9h-5v2h4q.825 0 1.413.588T21 13v2q0 .825-.588 1.413T19 17h-4Zm0-4v2h4v-2h-4Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'heading-6',
    },
    {
      name: 'material-symbols:format-quote-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M17.175 17q-.75 0-1.15-.638t-.05-1.312L17 13h-2q-.825 0-1.413-.588T13 11V8q0-.825.588-1.413T15 6h3q.825 0 1.413.588T20 8v4.525q0 .225-.038.463t-.162.437l-1.425 2.825q-.175.35-.5.55t-.7.2Zm-9 0q-.75 0-1.15-.638t-.05-1.312L8 13H6q-.825 0-1.413-.588T4 11V8q0-.825.588-1.413T6 6h3q.825 0 1.413.588T11 8v4.525q0 .225-.038.463t-.162.437L9.375 16.25q-.175.35-.5.55t-.7.2Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'quote',
    },
    {
      name: 'material-symbols:format-list-bulleted-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M10 19q-.425 0-.713-.288T9 18q0-.425.288-.713T10 17h10q.425 0 .713.288T21 18q0 .425-.288.713T20 19H10Zm0-6q-.425 0-.713-.288T9 12q0-.425.288-.713T10 11h10q.425 0 .713.288T21 12q0 .425-.288.713T20 13H10Zm0-6q-.425 0-.713-.288T9 6q0-.425.288-.713T10 5h10q.425 0 .713.288T21 6q0 .425-.288.713T20 7H10ZM5 20q-.825 0-1.413-.588T3 18q0-.825.588-1.413T5 16q.825 0 1.413.588T7 18q0 .825-.588 1.413T5 20Zm0-6q-.825 0-1.413-.588T3 12q0-.825.588-1.413T5 10q.825 0 1.413.588T7 12q0 .825-.588 1.413T5 14Zm0-6q-.825 0-1.413-.588T3 6q0-.825.588-1.413T5 4q.825 0 1.413.588T7 6q0 .825-.588 1.413T5 8Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'insertUnorderedList',
    },
    {
      name: 'material-symbols:format-list-numbered-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M3.75 22q-.325 0-.537-.213T3 21.25q0-.325.213-.537t.537-.213H5.5v-.75h-.75q-.325 0-.537-.213T4 19q0-.325.213-.537t.537-.213h.75v-.75H3.75q-.325 0-.537-.213T3 16.75q0-.325.213-.537T3.75 16H6q.425 0 .713.288T7 17v1q0 .425-.288.713T6 19q.425 0 .713.288T7 20v1q0 .425-.288.713T6 22H3.75Zm0-7q-.325 0-.537-.213T3 14.25v-2q0-.425.288-.713T4 11.25h1.5v-.75H3.75q-.325 0-.537-.213T3 9.75q0-.325.213-.537T3.75 9H6q.425 0 .713.288T7 10v1.75q0 .425-.288.713T6 12.75H4.5v.75h1.75q.325 0 .537.213T7 14.25q0 .325-.213.537T6.25 15h-2.5Zm1.5-7q-.325 0-.537-.213T4.5 7.25V3.5h-.75q-.325 0-.537-.213T3 2.75q0-.325.213-.537T3.75 2h1.5q.325 0 .537.213T6 2.75v4.5q0 .325-.213.537T5.25 8ZM10 19q-.425 0-.713-.288T9 18q0-.425.288-.713T10 17h10q.425 0 .713.288T21 18q0 .425-.288.713T20 19H10Zm0-6q-.425 0-.713-.288T9 12q0-.425.288-.713T10 11h10q.425 0 .713.288T21 12q0 .425-.288.713T20 13H10Zm0-6q-.425 0-.713-.288T9 6q0-.425.288-.713T10 5h10q.425 0 .713.288T21 6q0 .425-.288.713T20 7H10Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'insertOrderedList',
    },
    {
      name: 'material-symbols:format-indent-increase-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M4 21q-.425 0-.713-.288T3 20q0-.425.288-.713T4 19h16q.425 0 .713.288T21 20q0 .425-.288.713T20 21H4Zm8-4q-.425 0-.713-.288T11 16q0-.425.288-.713T12 15h8q.425 0 .713.288T21 16q0 .425-.288.713T20 17h-8Zm0-4q-.425 0-.713-.288T11 12q0-.425.288-.713T12 11h8q.425 0 .713.288T21 12q0 .425-.288.713T20 13h-8Zm0-4q-.425 0-.713-.288T11 8q0-.425.288-.713T12 7h8q.425 0 .713.288T21 8q0 .425-.288.713T20 9h-8ZM4 5q-.425 0-.713-.288T3 4q0-.425.288-.713T4 3h16q.425 0 .713.288T21 4q0 .425-.288.713T20 5H4Zm-.15 10.15q-.25.25-.55.125T3 14.8V9.2q0-.35.3-.475t.55.125l2.8 2.8q.15.15.15.35t-.15.35l-2.8 2.8Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'indent',
    },
    {
      name: 'material-symbols:format-indent-decrease-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M4 21q-.425 0-.713-.288T3 20q0-.425.288-.713T4 19h16q.425 0 .713.288T21 20q0 .425-.288.713T20 21H4Zm8-4q-.425 0-.713-.288T11 16q0-.425.288-.713T12 15h8q.425 0 .713.288T21 16q0 .425-.288.713T20 17h-8Zm0-4q-.425 0-.713-.288T11 12q0-.425.288-.713T12 11h8q.425 0 .713.288T21 12q0 .425-.288.713T20 13h-8Zm0-4q-.425 0-.713-.288T11 8q0-.425.288-.713T12 7h8q.425 0 .713.288T21 8q0 .425-.288.713T20 9h-8ZM4 5q-.425 0-.713-.288T3 4q0-.425.288-.713T4 3h16q.425 0 .713.288T21 4q0 .425-.288.713T20 5H4Zm2.15 10.15l-2.8-2.8Q3.2 12.2 3.2 12t.15-.35l2.8-2.8q.25-.25.55-.125T7 9.2v5.6q0 .35-.3.475t-.55-.125Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'outdent',
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
    {
      name: 'material-symbols:horizontal-rule-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M5 13q-.425 0-.713-.288T4 12q0-.425.288-.713T5 11h14q.425 0 .713.288T20 12q0 .425-.288.713T19 13H5Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'insertHorizontalRule',
    },
    {
      name: 'material-symbols:imagesmode-outline-rounded',
      icon: `url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm0-2h14V5H5v14Zm0 0V5v14Zm2-2h10q.3 0 .45-.275t-.05-.525l-2.75-3.675q-.15-.2-.4-.2t-.4.2L11.25 16L9.4 13.525q-.15-.2-.4-.2t-.4.2l-2 2.675q-.2.25-.05.525T7 17Zm1.5-7q.625 0 1.063-.438T10 8.5q0-.625-.438-1.063T8.5 7q-.625 0-1.063.438T7 8.5q0 .625.438 1.063T8.5 10Z"%2F%3E%3C%2Fsvg%3E')`,
      cmd: 'insertImage',
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

    container.contentDocument!.execCommand('enableAbsolutePositionEditor')
    container.contentDocument!.execCommand('enableInlineTableEditing')
    container.contentDocument!.execCommand('enableObjectResizing')
    container.contentDocument!.execCommand('insertBrOnReturn', false, 'true')
    container.contentDocument!.execCommand('useCSS', false, 'false')
    container.contentDocument!.execCommand('styleWithCSS', false, 'true')
    container.contentDocument!.execCommand('AutoUrlDetect', false, 'false')

    return container
  }

  #createController() {
    const controller = document.createElement('div')

    controller.id = `controller-${this.id}`

    controller.role = 'toolbar'
    controller.ariaOrientation = 'horizontal'

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
      button.tabIndex = 0

      button.ariaLabel = v.cmd

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
    editor.autocapitalize = 'none'
    editor.autofocus = true
    editor.contentEditable = 'true'
    editor.dir = 'ltr'
    editor.enterKeyHint = 'enter'
    editor.inputMode = 'text'
    editor.spellcheck = false
    editor.tabIndex = 0

    editor.role = 'textbox'
    editor.ariaAutoComplete = 'none'
    editor.ariaMultiLine = 'true'
    editor.ariaPlaceholder = 'edit richtext'
    editor.ariaReadOnly = 'false'
    editor.ariaRequired = 'false'

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
        case 'removeFormat':
          this.#container.contentDocument!.execCommand('removeFormat')
          break
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
        case 'insertParagraph':
          this.#container.contentDocument!.execCommand('insertParagraph')
          break
        case 'heading-1':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'H1')
          break
        case 'heading-2':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'H2')
          break
        case 'heading-3':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'H3')
          break
        case 'heading-4':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'H4')
          break
        case 'heading-5':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'H5')
          break
        case 'heading-6':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'H6')
          break
        case 'quote':
          this.#container.contentDocument!.execCommand('formatBlock', false, 'BLOCKQUOTE')
          break
        case 'insertOrderedList':
          this.#container.contentDocument!.execCommand('insertOrderedList')
          break
        case 'insertUnorderedList':
          this.#container.contentDocument!.execCommand('insertUnorderedList')
          break
        case 'indent':
          this.#container.contentDocument!.execCommand('indent')
          break
        case 'outdent':
          this.#container.contentDocument!.execCommand('outdent')
          break
        case 'createLink':
          const link = window.prompt('Please input the link')
          if (typeof link === 'string') this.#container.contentDocument!.execCommand('createLink', false, link)
          break
        case 'unlink':
          this.#container.contentDocument!.execCommand('unlink')
          break
        case 'insertHorizontalRule':
          this.#container.contentDocument!.execCommand('insertHorizontalRule')
          break
        case 'insertImage':
          const image = window.prompt('Please input the source of image')
          if (typeof image === 'string') this.#container.contentDocument!.execCommand('insertImage', false, image)
          break
      }
    }
  }
}
