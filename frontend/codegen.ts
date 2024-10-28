import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3001",
  config: {
    sort: false
  },
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/__generated__/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: "gql"
      },
    },
    "./src/__generated__/types.ts": {
      plugins: [
        {
          "typescript": {
            skipTypename: true,
            sort: false
          }
        },
        "typescript-operations"
      ],
    },
  },
  ignoreNoDocuments: true,
};

export default config;