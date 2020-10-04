import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {TodoAccess} from "../../datalayer/todoAccess";
import {createLogger} from "../../utils/logger";
import { getUserId } from '../../utils/user';

const todoAccess = new TodoAccess();
const logger = createLogger('updateTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    logger.debug(`updateTodo(${todoId})`)

    const userId = getUserId(event);

    await todoAccess.updateTodo(todoId,userId, updatedTodo)

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ""
    }
}
