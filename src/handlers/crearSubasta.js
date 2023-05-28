import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const crearSubasta = async (event, context) => {
    try {
        const subasta = event.body;
        const now = new Date();
        const fechaFin = new Date();
        fechaFin.setHours(now.getHours() + 1);

        const newSubasta = {
            ...subasta,
            status: "ABIERTA",
            id: uuid(),
            fechaInicio: now.toISOString(),
            fechaFin: fechaFin.toISOString(),
            ofertaMayor: {
                cantidad: 0,
            },
        };

        await dynamo.send(new PutCommand({
            TableName: "SubastasTable",
            Item: newSubasta,
        }));

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };

        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify(newSubasta),
        };
    }
    catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
};

export const handler = commonMiddleware(crearSubasta);