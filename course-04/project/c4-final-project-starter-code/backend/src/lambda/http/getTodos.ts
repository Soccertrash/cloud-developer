import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {TodoAccess} from "../../datalayer/todoAccess";
import {createLogger} from "../../utils/logger";

const todoAccess = new TodoAccess();
const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.debug('Processing event:', event);

    const items = await todoAccess.getAllTodos();

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
