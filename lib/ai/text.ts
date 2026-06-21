// House style: no em dashes in published prose. Strip them from model output.
export function deEmDash(text: string): string {
  return text.replace(/\s*[—–]\s*/g, ', ')
}
