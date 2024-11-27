import { on, emit, showUI } from "@create-figma-plugin/utilities";
import { parseComponentDescription } from "./parseDescription";
import { ComponentDescription } from "./parseDescription";

interface ComponentData {
  [key: string]: ComponentDescription;
}

export default async function () {
  const pages = figma.root.children;

  const result: ComponentData = {};

  on("GET_DESCRIPTIONS", async function () {
    const foundComponents = getComponentsFromPage(pages);
    for (const component of foundComponents) {
      const componentData: ComponentData = {};
      const name = component.name;
      const description = parseComponentDescription(component.description);
      result[name] = description;
    }
    emit("DONE", result);
  });
}
showUI({
  height: 72,
  width: 240,
});

export function getComponentsFromPage(pages: PageNode[] | readonly PageNode[]) {
  const components: any = [];
  for (const page of pages) {
    const componentsAndSets = page.findAllWithCriteria({
      types: ["COMPONENT", "COMPONENT_SET"],
    });
    componentsAndSets.forEach((item) => {
      if (
        !item.name.startsWith(".") &&
        item.description.toLowerCase().includes("ℹ️")
      ) {
        components.push(item);
      }
    });
  }
  return components;
}
