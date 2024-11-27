import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { pushToGithub } from "./pushToGithub";

function Plugin() {
  const [metadataJson, setMetadataJson] = useState("");
  const handleBackupClick = useCallback(function () {
    emit("GET_DESCRIPTIONS");
  }, []);

  on("DONE", (data) => {
    if (!data) return;
    const JsonData = JSON.stringify(data, null, 2);
    setMetadataJson(JsonData);
  });

  useEffect(() => {
    if (!metadataJson) return;
    console.log("pushing to github");
    pushToGithub(metadataJson);
  }, [metadataJson]);

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <div>
        <Button
          fullWidth
          onClick={handleBackupClick}
          secondary
          style={{ backgroundColor: "#5ffe84", border: "none" }}
        >
          Get metadata
        </Button>
      </div>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
