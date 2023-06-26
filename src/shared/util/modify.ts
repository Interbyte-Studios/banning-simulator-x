/**
 * Modifies `T` by applying `X`'s changes on top.
 */
export type Modify<T, X> = Pick<T, Exclude<keyof T, keyof X>> & X;
