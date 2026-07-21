// Guards React's DOM commit path against nodes that a browser page-translator
// (Chrome / Google Translate, Edge, etc.) moved or re-wrapped behind React's
// back. Because <html lang="pt"> prompts foreign visitors to translate, the
// translator rewraps our text nodes, and React later tries to removeChild /
// insertBefore a node whose parent it no longer owns — throwing
// `NotFoundError: Failed to execute 'removeChild' on 'Node'` and white-screening
// the SPA mid booking/lead flow.
//
// The standard defensive patch: make removeChild / insertBefore no-op (instead
// of throw) when the node isn't actually a child of the expected parent. React
// then reconciles from the real DOM on the next render instead of crashing.
// See https://github.com/facebook/react/issues/11538.

let patched = false;

export function patchDomForTranslation(): void {
  if (patched || typeof Node !== 'function' || typeof window === 'undefined') return;
  patched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      if (console) {
        console.warn(
          'Skipped removeChild on a node whose parent was changed by an external script (likely page translation).',
          child,
        );
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  } as typeof Node.prototype.removeChild;

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.warn(
          'Skipped insertBefore against a reference node whose parent was changed by an external script (likely page translation).',
          referenceNode,
        );
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  } as typeof Node.prototype.insertBefore;
}
