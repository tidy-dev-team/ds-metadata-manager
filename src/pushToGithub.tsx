import { Buffer } from "buffer";
import envConfig from "./envConfig";
export async function pushToGithub(metadataJson: string) {
  try {
    const getCurrentFile = await fetch(
      "https://api.github.com/repos/tidy-dev-team/kido-ds-metadata/contents/component-metadata.json",
      {
        headers: {
          Authorization: `Bearer ${envConfig.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (getCurrentFile.ok) {
      const fileData = await getCurrentFile.json();
      const response = await fetch(
        "https://api.github.com/repos/tidy-dev-team/kido-ds-metadata/contents/component-metadata.json",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${envConfig.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Metadata updated",
            content: Buffer.from(metadataJson).toString("base64"),
            sha: fileData.sha,
            branch: "main",
          }),
        }
      );

      if (response.ok) {
        console.log("Successfully updated metadata in GitHub");
      } else {
        console.log("Failed to update metadata:", await response.text());
      }
    } else {
      const response = await fetch(
        "https://api.github.com/repos/tidy-dev-team/kido-ds-metadata/contents/component-metadata.json",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${envConfig.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Create component metadata",
            content: Buffer.from(metadataJson).toString("base64"),
            branch: "main",
          }),
        }
      );

      if (response.ok) {
        console.log("Successfully created metadata in GitHub");
      } else {
        console.log("Failed to create metadata:", await response.text());
      }
    }
  } catch (error) {
    console.error("Error pushing to GitHub:", error);
  }
}
