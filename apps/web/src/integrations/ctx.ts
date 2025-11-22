import { deepmerge } from "deepmerge-ts";

export function extendContext<T, Q>(ctx: T, extend: Q) {
  return deepmerge(ctx, extend);
}
