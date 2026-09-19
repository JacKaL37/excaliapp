// Serializes an Excalidraw scene to the .excalidraw file format.
// Extracted from EditorPane.handleChange so the curated appState
// fields are unit-testable. Add fields here when the app must
// persist them per file.
export function serializeExcalidrawScene(
  elements: readonly any[],
  appState: any,
  files: any
): string {
  return JSON.stringify(
    {
      type: 'excalidraw',
      version: 2,
      source: 'ExcaliApp',
      elements,
      appState: {
        gridSize: appState.gridSize,
        viewBackgroundColor: appState.viewBackgroundColor,
        currentItemFontFamily: appState.currentItemFontFamily,
        currentItemFontSize: appState.currentItemFontSize,
        currentItemStrokeColor: appState.currentItemStrokeColor,
        currentItemBackgroundColor: appState.currentItemBackgroundColor,
        currentItemFillStyle: appState.currentItemFillStyle,
        currentItemStrokeWidth: appState.currentItemStrokeWidth,
        currentItemRoughness: appState.currentItemRoughness,
        currentItemOpacity: appState.currentItemOpacity,
        currentItemTextAlign: appState.currentItemTextAlign,
        theme: appState.theme,
      },
      files,
    },
    null,
    2
  )
}
