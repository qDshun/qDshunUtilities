export class GetLastMessagesRequest {
    constructor(msgCount: number,  worldId: string)
    {
        this.msgCount = msgCount;
        this.worldId = worldId;
    }
    msgCount!: number;
    worldId!: string;
  }
  