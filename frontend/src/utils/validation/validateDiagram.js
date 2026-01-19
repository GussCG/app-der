import { validateEntities } from "./rules/entityRules";
import { validateRelations } from "./rules/relationRules";
import { validateAttributeNames } from "./rules/attributesRules";
import { validateUniqueNames } from "./rules/globalRules";

export function validateDiagram(diagram) {
  return [
    ...validateEntities(diagram.entities, diagram.relations),
    ...validateRelations(diagram.relations, diagram.entities),
    ...validateAttributeNames([
      ...diagram.entities.map((e) => ({ ...e, kind: "entity" })),
      ...diagram.relations.map((r) => ({ ...r, kind: "relation" })),
    ]),
    ...validateUniqueNames(diagram.entities, diagram.relations),
  ];
}
