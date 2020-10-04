import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {TodoAccess} from "../../datalayer/todoAccess";
import {createLogger} from "../../utils/logger";
import {getUserId} from "../utils";

const todoAccess = new TodoAccess();
const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.debug('Processing event:', event);

    const userId = getUserId(event);

    const items = await todoAccess.getAllTodos(userId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: items
        })
    }
}
