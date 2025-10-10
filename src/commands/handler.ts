import cmd, { type Command } from "./map";
import type { ProcMsg } from "../utils/msg";
import type { CommandContext } from "./map";

class CommandHandler {
  async handleCommand(
    processedMessage: ProcMsg,
    socket: any,
    store: any,
  ): Promise<void> {
    const messageText = processedMessage.body.trim() || "";
    const parseResult = this.parseCommand(messageText);
    const commandName = parseResult[0];
    const args = parseResult[1];
    const context: CommandContext = {
      m: processedMessage,
      sock: socket,
      store: store,
      args,
      command: commandName,
      isCmd: this.isCommand(messageText),
    };
    for (const command of cmd.values()) {
      if (command.middleware) {
        await Promise.resolve(command.middleware(context));
      }
    }
    if (!this.isCommand(messageText)) return;
    const foundCommand = cmd
      .values()
      .find((plugin: Command) =>
        plugin?.name
          ? plugin.name.toLowerCase().trim() ===
            commandName.toLowerCase().trim()
          : plugin?.alias &&
            plugin.alias
              .map((a: string) => a.toLowerCase().trim())
              .includes(commandName.toLowerCase().trim()),
      );
    if (!foundCommand) return;
    if (process.env.isSelf && processedMessage.sender.split("@")[0] !== process.env.OWNER) return console.log("SELF MODE: ACTIVE")
    try {
      if (foundCommand.run) {
        if (!this.checkPermissions(foundCommand, processedMessage)) {
          processedMessage.reply(
            "You do not have permission to use this command.",
          );
          return;
        }
        await Promise.resolve(foundCommand.run(context));
      }
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
      processedMessage.reply(
        `An error occurred while executing the command: ${(error as Error).message}`,
      );
    }
  }

  private isCommand(text: string): boolean {
    return /^(!|\/|\.)/.test(text);
  }

  private parseCommand(text: string): [string, string[]] {
    const args = text.slice(1).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase() || "";
    return [commandName, args];
  }

  private checkPermissions(command: Command, message: ProcMsg): boolean {
    if (command.isOwner && message.sender.split("@")[0] !== process.env.OWNER) {
      return false;
    }

    if (command.isGroup && !message.isGroup) {
      return false;
    }
    if (command.isPrivate && message.isGroup) {
      return false;
    }

    if (command.isSelf && !message.fromMe) {
      return false;
    }
    return true;
  }
}

export default new CommandHandler();
