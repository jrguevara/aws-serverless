import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import validator from "@middy/validator";
import { transpileSchema } from '@middy/validator/transpile';
import createError from "http-errors";
import listarSubastasSchema from "../../lib/schemas/listarSubastasSchema";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const listarSubastas = async (event, context) => {
    try {
        const { status } = event.queryStringParameters;
        let subastas;

        const params = {
            TableName: "SubastasTable",
            IndexName: "statusFechaFinIndex",
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': status,
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        };

        const result = await dynamo.send(new QueryCommand(params));

        subastas = result.Items;

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(subastas),
        };
    }
    catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
};

export const handler = commonMiddleware(listarSubastas).use(
    validator({
        eventSchema : transpileSchema(listarSubastasSchema),
        ajvOptions: {
            useDefaults: true,
            strict: false,
        },
    })
);