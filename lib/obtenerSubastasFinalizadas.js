import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function obtenerSubastasFinalizadas() {
    const now = new Date();
    const params = {
        TableName: "SubastasTable",
        IndexName: "statusFechaFinIndex",
        KeyConditionExpression: '#status = :status AND fechaFin <= :now',
        ExpressionAttributeValues: {
            ':status': 'ABIERTA',
            ':now': now.toISOString(),
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };

    const result = await dynamo.send(new QueryCommand(params));
    return result.Items;
};
