/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { promises as fs } from 'fs';
import { isAbsolute, resolve } from 'path';
import { EndpointConfiguration, Logger } from './shared.js';
import { exists as exists } from './file-system-helper.js';

export class Configuration {

  private static _instance: Readonly<Configuration> | null = null;
  public static get instance(): Readonly<Configuration> {
    const instance = this._instance;
    if (instance !== null) {
      return instance;
    }
    throw new Error('Configuration is not yet initialized.');
  }

  public static async createFromCLIArgs(args: string[]): Promise<Readonly<Configuration>> {
    if (this._instance !== null) {
      throw new Error('Configuration is already initialized.');
    }
    const numArgs = args.length;
    if (numArgs % 2 !== 0) {
      throw new Error('Incorrect number of arguments. Forgot to provide any value?');
    }

    const unconsumedArgs: string[] = [];
    const instance = new Configuration();
    for (let i = 0; i < numArgs; i += 2) {
      const option = args[i];
      switch (option.replace(/^-*/g, '')) {
        case 'config': {
          if (i !== 0) {
            throw new Error('When providing a configuration file, the --config needs to be the first CLI argument.');
          }
          const configPath = resolve(process.cwd(), args[i + 1]);
          if (!await exists(configPath) || !(await fs.stat(configPath)).isFile()) {
            throw new Error(`The config file "${configPath}" does not exist.`);
          }
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          await instance.applyConfiguration(await require(configPath) as ConfigSchema);
          break;
        }
        case 'endpoint':
          instance.setEndpoints(args[i + 1]);
          break;
        case 'endpoints':
          instance.setEndpoints(JSON.parse(args[i + 1]) as string | EndpointConfiguration[]);
          break;
        case 'outputDir': {
          await instance.setOutputDir(args[i + 1], true);
          break;
        }
        case 'quoteStyle':
          instance.setQuote(args[i + 1] as QuoteStyle);
          break;
        case 'indentSize':
          instance.setIndentation(args[i + 1]);
          break;
        default:
          unconsumedArgs.push(option);
          break;
      }
    }
    if (unconsumedArgs.length > 0) {
      Logger.warn(`Unconsumed args: ${unconsumedArgs.join(', ')}`);
    }
    return this._instance = Object.freeze(instance);
  }

  public static dispose(): void {
    this._instance = null;
  }

  public endpoints: EndpointConfiguration[] = [];
  public outputDir: string = null!;
  public quote: '\'' | '"' = '\'';
  public indent: string = ' '.repeat(4);

  private constructor() { /* noop */ }

  private async applyConfiguration(config: ConfigSchema) {
    await this.setOutputDir(config.outputDir, false);
    this.setEndpointsFromConfig(config);
    this.setQuote(config.quoteStyle);
    this.setIndentation(config.indentSize);
  }

  private setEndpointsFromConfig(config: ConfigSchema) {
    const endpoint = config.endpoint;
    const endpoints = config.endpoints;
    if (endpoint && endpoints) {
      throw new Error('Both `endpoint`, and `endpoints` properties cannot be specified.');
    }
    this.setEndpoints((endpoints ?? endpoint)!);
  }

  private setEndpoints(endpoints: string | EndpointConfiguration[]) {
    const $endpoints = this.endpoints;
    if ($endpoints.length !== 0) {
      throw new Error('Endpoint(s) is/are already set. Are you specifying both `endpoint`, and `endpoints`?');
    }
    if (typeof endpoints === 'string') {
      $endpoints.push(new EndpointConfiguration(endpoints, ''));
    } else if (Array.isArray(endpoints)) {
      for (const ep of endpoints) {
        const dir = ep.outputDir;
        $endpoints.push(new EndpointConfiguration(ep.url, dir, ep.ignore));
      }
    }
    this.adjustOutputPaths();
  }

  private async setOutputDir(outputDir: string | undefined, throwError: boolean) {
    if (!outputDir) { return; }
    const absolutePath: string = resolve(process.cwd(), outputDir);
    if (!await exists(absolutePath)) {
      await fs.mkdir(absolutePath, { recursive: true });
    } else if (throwError && !(await fs.stat(absolutePath)).isDirectory()) {
      throw new Error(`The output path "${absolutePath}" is not a directory.`);
    }
    this.outputDir = absolutePath;
    this.adjustOutputPaths();
  }

  private setQuote(quoteStyle: QuoteStyle | undefined) {
    if (!quoteStyle) { return; }
    switch (quoteStyle) {
      case 'single':
        this.quote = '\'';
        break;
      case 'double':
        this.quote = '"';
        break;
      default:
        Logger.warn(`Unsupported quoteStyle: '${String(quoteStyle)}'; default value will be used.`);
        break;
    }
  }

  private setIndentation(indentSize: number | string | undefined) {
    if (!indentSize) { return; }
    const numIdent = Number(indentSize);
    if (!Number.isNaN(numIdent)) {
      this.indent = ' '.repeat(numIdent);
    } else {
      Logger.warn(`Unsupported indent: '${String(indentSize)}'; default value will be used.`);
    }
  }

  private adjustOutputPaths() {
    const baseOutputDir = this.outputDir;
    const endpoints = this.endpoints;
    if (!baseOutputDir || endpoints.length === 0) { return; }
    for (const ep of endpoints) {
      const epDir = ep.outputDir;
      ep.outputDir = isAbsolute(epDir) ? epDir : resolve(baseOutputDir, epDir);
    }
  }
}

type QuoteStyle = 'single' | 'double';
type ConfigSchema = Partial<
  Omit<Configuration, 'quote' | 'indent'>
  & {
    quoteStyle: QuoteStyle;
    indentSize: string | number;
    endpoint: string;
    endpoints: EndpointConfiguration[];
  }
>;