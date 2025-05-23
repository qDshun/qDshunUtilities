import { WorldObjectType } from "@models/business";

export class CreateWorldObjectRequest {
  type!: WorldObjectType;
  name!: string;
  templateId!: string | null;
  parentId!: string | null;
  previousId!: string | null;
  previewImageUrl!: string | null;
  tokenImageUrl!: string | null;
}
