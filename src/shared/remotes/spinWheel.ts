import Net from "@rbxts/net";

export const spinWheelDefinition = Net.Definitions.ServerAsyncFunction<() => number | undefined>();
export type SpinWheelDefinition = typeof spinWheelDefinition;
