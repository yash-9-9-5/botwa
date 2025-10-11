import type { ProcMsg } from "../utils/msg.js";

export interface CommandContext {
  m: ProcMsg;
  sock: any;
  store: any;
  text: string;
  args: string[];
  command: string;
  isCmd: boolean;
}

export interface Command {
  name: string;
  category?: string[];
  alias?: string[];
  isOwner?: boolean;
  isGroup?: boolean;
  isPrivate?: boolean;
  isSelf?: boolean;
  desc?: string;
  usage?: string;
  example?: string;
  run?: (ctx: CommandContext) => Promise<void> | void;
  middleware?: (ctx: CommandContext) => Promise<void> | void;
}

class CmdMap {
  public commands: Command[] = [];

  public values(): Command[] {
    return this.commands;
  }

  public add(content: Partial<Command>): void {
    this.commands.push(content as Command);
  }

  public reset(): void {
    this.commands = [];
  }

  public size(): number {
    return this.commands.length;
  }
}

export default new CmdMap();