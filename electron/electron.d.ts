export {}

declare global {
  interface Window {
    electron: {
      scanFetch: () => Promise<any> // Define los métodos que necesitas
      // Otros métodos o propiedades de `electron`
    }
  }
}
