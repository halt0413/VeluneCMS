export type CliOptions = Record<string, string | true>;

export function parseOptions(args: string[]): CliOptions {
  const options: CliOptions = {};

  // 今は `--key value` と `--flag` だけを扱う 複雑なCLI仕様が必要になったら専用parserへ置き換える
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = args[index + 1];

    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    index += 1;
  }

  return options;
}
