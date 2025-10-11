import cmd, { type CommandContext } from "../../commands/map.js";
import util from "util";
import { exec as execCb } from "child_process";
const exec = util.promisify(execCb);

const blacklist: string[] = [];

cmd.add({
  name: "exec",
  alias: ["shell", "$"],
  category: ["owner"],
  desc: "Execute shell command (owner only)",
  usage: ".exec [command]",
  example: ".exec ls -la",
  isOwner: true,
  async run({ m, args }: CommandContext) {
    const command = args.join(" ").trim();
    if (!command) return m.reply("Masukkan command.");

    const lower = command.toLowerCase();
    if (blacklist.some((b) => lower.includes(b))) {
      return m.reply("Command diblokir karena berpotensi berbahaya.");
    }

    try {
      const { stdout, stderr } = await exec(command, {
        timeout: 10000,
        maxBuffer: 1024 * 1024,
      });
      let out = "";
      if (stdout) out += `STDOUT:\n${stdout.trim()}\n`;
      if (stderr) out += `STDERR:\n${stderr.trim()}\n`;
      if (!out) out = "No output.";
      m.reply("```" + out + "```");
    } catch (err: any) {
      m.reply(
        "Error:\n```" + (err.stderr || err.message || String(err)) + "```",
      );
    }
  },
});

cmd.add({
  name: "eval",
  alias: ["ev", "="],
  category: ["owner"],
  desc: "Execute JavaScript/TypeScript code (owner only)",
  usage: ".eval [code]",
  example: ".eval 2 + 2",
  isOwner: true,
  async run({ m, args }: CommandContext) {
    const text = args.join(" ");
    if (!text) return m.reply("Mana code nya woi");
    let result = "";
    if (/let|var|return|const|await/.test(text)) {
      result = `(async() => {\n${text}\n})()`;
    } else {
      result = text;
    }
    const execute = await eval(result);
    m.reply(util.format(execute));
  },
});
