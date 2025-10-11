import cmd, { type CommandContext } from "../commands/map.js";

cmd.add({
  name: "test",
  alias: ["test"],
  category: ["test"],
  desc: "Test command",
  async run({ m }: CommandContext) {
    m.reply("Test command works!");
  },
});