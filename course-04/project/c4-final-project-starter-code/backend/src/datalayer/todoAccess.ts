import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { createLogger } from "../utils/logger";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const logger = createLogger('datalayer');


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODO_TABLE) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all items')

    const result = await this.docClient.scan({
      TableName: this.todoTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.debug("CreateTodo", todo)
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()
    logger.debug("Done", todo)

    return todo
  }


  async updateTodo(todoId: string, todo: UpdateTodoRequest) {
    logger.debug(`UpdateTodo (${todoId})`, todo)

    await this.docClient.update(
      {
        TableName: this.todoTable,
        Key: { "todoId": todoId },
        ExpressionAttributeNames: { "#nameAlt": "name" },
        UpdateExpression: "set #nameAlt = :n, dueDate = :d, done = :o",
        ExpressionAttributeValues: {
          ":n": todo.name,
          ":d": todo.dueDate,
          ":o": todo.done
        },
        ReturnValues: "UPDATED_NEW"

      }
    ).promise();

  }

  async setUpdateUrl(todoId: string, url: string) {
    logger.debug(`setUpdateUrl (${todoId}, ${url})`)

    await this.docClient.update(
      {
        TableName: this.todoTable,
        Key: { "todoId": todoId },
        UpdateExpression: "set attachmentUrl = :u",
        ExpressionAttributeValues: {
          ":u": url
        },
        ReturnValues: "UPDATED_NEW"

      }
    ).promise();

  }

  async deleteTodo(todoId: string) {
    logger.debug(`Delete (${todoId}`)

    await this.docClient.delete(
      {
        TableName: this.todoTable,
        Key: { "todoId": todoId }
      }
    ).promise();

  }


}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
