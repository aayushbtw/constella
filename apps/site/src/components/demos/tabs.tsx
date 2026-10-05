import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoRow } from "~/components/demos/frame";

function TabsDemo() {
  return (
    <DemoRow>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
      </Tabs>
    </DemoRow>
  );
}

export { TabsDemo };
