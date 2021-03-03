import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

export class Configuration {

  private static _instance: Readonly<Configuration> | null = null;
  public static get instance(): Readonly<Configuration> {
    const instance = this._instance;
    if (instance !== null) {
      return instance;
    }
    throw new Error('Configuration is not yet initialized.');
  }

  public static createFromCLIArgs(args: string[]): Configuration {
    if (this._instance !== null) {
      throw new Error('Configuration is already initialized.');
    }
    const numArgs = args.length;
    if (numArgs % 2 !== 0) {
      throw new Error('Incorrect number of arguments. Forgot to provide any value?');
    }

    const instance = new Configuration();
    for (let i = 0; i < numArgs; i += 2) {
      switch (args[i].replace(/^-*/g, '')) {
        case 'endpoint':
          instance.endpoint = args[i + 1];
          break;
        case 'outputDir': {
          const dir: string = resolve(process.cwd(), args[i + 1]);
          if (!existsSync(dir) || !statSync(dir).isDirectory()) {
            throw new Error(`The output dir "${dir}" does not exist or it is not a directory.`);
          }
          instance.baseOutputPath = dir;
          break;
        }
      }
    }
    return this._instance = Object.freeze(instance);
  }

  public static dispose(): void {
    this._instance = null;
  }

  public endpoint!: string;
  public baseOutputPath!: string;
  private constructor() { /* noop */ }
}