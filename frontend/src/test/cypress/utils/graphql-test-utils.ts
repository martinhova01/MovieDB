// See: https://github.com/cypress-io/cypress/issues/27973
import { CyHttpMessages } from "../../../../node_modules/cypress/types/net-stubbing.js";

interface GraphQLRequestBody {
    operationName: string;
    query: string;
    variables: Record<string, unknown>;
}

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (
    req: CyHttpMessages.IncomingHttpRequest<GraphQLRequestBody, unknown>,
    operationName: string
) => {
    const { body } = req;
    return (
        Object.prototype.hasOwnProperty.call(body, "operationName") &&
        body.operationName === operationName
    );
};

// Alias query if operationName matches
export const aliasQuery = (
    req: CyHttpMessages.IncomingHttpRequest<GraphQLRequestBody, unknown>,
    operationName: string
) => {
    if (hasOperationName(req, operationName)) {
        req.alias = `gql${operationName}Query`;
    }
};

// Alias mutation if operationName matches
export const aliasMutation = (
    req: CyHttpMessages.IncomingHttpRequest<GraphQLRequestBody, unknown>,
    operationName: string
) => {
    if (hasOperationName(req, operationName)) {
        req.alias = `gql${operationName}Mutation`;
    }
};
