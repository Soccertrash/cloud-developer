const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
    // TODO: Use these variables to record metric values
    let endTime
    let requestWasSuccessful

    const startTime = timeInMs()
    try {
        let response = await axios.get(url);
        requestWasSuccessful = response.status / 100 === 2;
    } catch (e) {
        requestWasSuccessful = false;
    }
    endTime = timeInMs();
    const delta = endTime - startTime;

    // Example of how to write a single data point
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: 'Latency', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
                Dimensions: [
                    {
                        Name: 'ServiceName',
                        Value: serviceName
                    }
                ],
                Unit: 'Milliseconds', // 'Count' or 'Milliseconds'
                Value: delta // Total value
            }
        ],
        Namespace: 'Udacity/Serveless'
    }).promise()

    if (requestWasSuccessful) {
        // Example of how to write a single data point
        await cloudwatch.putMetricData({
            MetricData: [
                {
                    MetricName: 'Count', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
                    Dimensions: [
                        {
                            Name: 'ServiceName',
                            Value: serviceName
                        }
                    ],
                    Unit: 'Count', // 'Count' or 'Milliseconds'
                    Value: delta // Total value
                }
            ],
            Namespace: 'Udacity/Serveless'
        }).promise()

    }
}

function timeInMs() {
    return new Date().getTime()
}
