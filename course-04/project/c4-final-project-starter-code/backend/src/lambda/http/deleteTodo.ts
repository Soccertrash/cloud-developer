import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {TodoAccess} from "../../datalayer/todoAccess";
import {createLogger} from "../../utils/logger";

const todoAccess = new TodoAccess();
const logger = createLogger('deleteTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.debug("DeleteTodo: " + todoId);
    await todoAccess.deleteTodo(todoId);

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ""
    }

}
