# VeluneCMS Client

```ts
import { createCmsClient } from "@velune-cms/client";

const cms = createCmsClient({
  baseUrl: "https://your-api.example.com"
});

const portfolio = await cms.listContents({
  contentType: "portfolio"
});

const page = await cms.getContentBySlug("welcome");
```

By default, draft contents are filtered out. Pass `includeDrafts: true` when you need drafts in a trusted environment.
