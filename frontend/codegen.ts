import { BACKEND_URL } from "./src/utils/config";
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: BACKEND_URL,
    config: {
        namingConvention: "keep",
        sort: false,
        scalars: {
            DateTime: "Date",
        },
    },
    documents: ["src/**/*.ts"],
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
