import 'source-map-support/register'
import * as uuid from 'uuid'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {TodoAccess} from "../../datalayer/todoAccess";
import {createLogger} from "../../utils/logger";
import {TodoItem} from "../../models/TodoItem";
import {parseUserId} from "../../auth/utils";
//import {parseUserId} from "../../auth/utils";

const todoAccess = new TodoAccess();
const logger = createLogger('createTodo');

function getUserId(event: APIGatewayProxyEvent) {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    return parseUserId(jwtToken);
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.debug('Process createTodo', event);

    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const todoId = uuid.v4()
    const userId = getUserId(event);

    const todoItem: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false

    }

    const result = await todoAccess.createTodo(todoItem);

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            result
        })
    }
}
