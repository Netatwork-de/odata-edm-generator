export class Configuration {
  private static _instance: Configuration | null = null;
  public static get instance(): Configuration {
    const instance = this._instance;
    if (instance !== null) {
      return instance;
    }
    throw new Error('Configuration is not yet initialized.');
  }

  public static create(endpoint: string, baseOutputPath: string): Configuration {
    return this._instance = new Configuration(endpoint, baseOutputPath);
  }

  public static dispose(): void {
    this._instance = null;
  }

  private constructor(
    public readonly endpoint: string,
    public readonly baseOutputPath: string,
  ) { }
}