export function toUpperPreservingCursor(input) {
    const { selectionStart, selectionEnd } = input;
    input.value = input.value.toUpperCase();
    input.setSelectionRange(selectionStart, selectionEnd);
}