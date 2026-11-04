export interface IOutputStrategy {
  output(data: Record<string, string>[]): Promise<void>;
}
