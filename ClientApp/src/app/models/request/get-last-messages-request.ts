export class GetLastMessages {
    constructor(msgCount: number,  worldId: string)
    {
        this.msgCount = msgCount;
        this.worldId = worldId;
    }
    msgCount!: number;
    worldId!: string;
  }
  