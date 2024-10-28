import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:3001",
    config: {
        sort: false,
        scalars: {
            DateTime: "Date",
        },
    },
    documents: ["src/**/*.tsx"],
    generates: {
        "./src/types/__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql",
            },
        },
        "./src/types/__generated__/types.ts": {
            plugins: ["typescript", "typescript-operations"],
        },
    },
    ignoreNoDocuments: true,
};

export default config;
