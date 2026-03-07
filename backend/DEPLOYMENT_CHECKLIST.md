# GramVaani Backend - Deployment Checklist

Use this checklist to ensure successful deployment.

## Pre-Deployment

### Environment Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS credentials configured (`aws sts get-caller-identity`)
- [ ] Correct AWS region set (default: us-east-1)

### Code Preparation
- [ ] All Lambda function dependencies installed
- [ ] Code tested locally (if possible)
- [ ] Environment variables documented
- [ ] API endpoints defined

## Deployment Steps

### 1. DynamoDB Setup
- [ ] Create DynamoDB table using schema
- [ ] Verify table is active
- [ ] Note table name: `gramvaani-complaints`
- [ ] Verify indexes created (timestamp-index, village-index)

```bash
aws dynamodb describe-table --table-name gramvaani-complaints
```

### 2. IAM Role Setup
- [ ] Create Lambda execution role
- [ ] Attach AWSLambdaBasicExecutionRole policy
- [ ] Attach DynamoDB access policy
- [ ] Note role ARN for Lambda creation

```bash
aws iam get-role --role-name gramvaani-lambda-role
```

### 3. Lambda Functions
- [ ] Package all three Lambda functions
- [ ] Upload process-voice function
- [ ] Upload get-complaints function
- [ ] Upload get-stats function
- [ ] Set TABLE_NAME environment variable for each
- [ ] Set timeout to 30 seconds for each
- [ ] Verify execution role attached

```bash
aws lambda list-functions | grep gramvaani
```

### 4. API Gateway Setup
- [ ] Create REST API
- [ ] Create /complaints resource
- [ ] Create POST method for /complaints
- [ ] Create GET method for /complaints
- [ ] Create /stats resource
- [ ] Create GET method for /stats
- [ ] Enable CORS for all methods
- [ ] Deploy API to stage (e.g., "prod")
- [ ] Note Invoke URL

```bash
# Test invoke URL
curl https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/stats
```

### 5. Test Data
- [ ] Populate test data using script
- [ ] Verify data in DynamoDB
- [ ] Check at least 10 records exist

```bash
aws dynamodb scan --table-name gramvaani-complaints --select COUNT
```

## Post-Deployment Testing

### API Endpoint Tests
- [ ] Test POST /complaints (submit new complaint)
- [ ] Test GET /complaints (retrieve all)
- [ ] Test GET /complaints?village=Rampur (filter by village)
- [ ] Test GET /complaints?category=Water (filter by category)
- [ ] Test GET /stats (get statistics)

### Validation Checks
- [ ] Response times < 3 seconds
- [ ] CORS headers present in responses
- [ ] Error handling works (test with invalid data)
- [ ] Classification logic working (check categories)
- [ ] Sentiment analysis returning values
- [ ] Urgency detection working

### Integration Tests
- [ ] Frontend can connect to API
- [ ] Dashboard displays data correctly
- [ ] Filters work in frontend
- [ ] Statistics update properly

## Configuration

### Environment Variables
Record your deployment configuration:

```
AWS_REGION=us-east-1
TABLE_NAME=gramvaani-complaints
API_BASE_URL=https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod
```

### Lambda Function Names
- [ ] gramvaani-process-voice
- [ ] gramvaani-get-complaints
- [ ] gramvaani-get-stats

### API Gateway
- [ ] API Name: GramVaani API
- [ ] Stage: prod
- [ ] Invoke URL: ___________________________

## Monitoring Setup

### CloudWatch
- [ ] Enable CloudWatch Logs for Lambda functions
- [ ] Set log retention period (e.g., 7 days)
- [ ] Create CloudWatch dashboard (optional)
- [ ] Set up alarms for errors (optional)

### API Gateway Logging
- [ ] Enable execution logging
- [ ] Enable access logging
- [ ] Set log level to INFO

## Security Checklist

- [ ] Lambda functions have minimal IAM permissions
- [ ] DynamoDB table has encryption at rest enabled
- [ ] API Gateway has throttling enabled (optional)
- [ ] CORS configured correctly (not too permissive)
- [ ] No sensitive data in logs
- [ ] Environment variables used for configuration

## Documentation

- [ ] API documentation shared with frontend team
- [ ] Postman collection imported and tested
- [ ] Deployment notes documented
- [ ] Known issues documented
- [ ] Rollback procedure documented

## Frontend Integration

- [ ] API base URL shared with frontend team
- [ ] CORS working from frontend domain
- [ ] API response format matches frontend expectations
- [ ] Error handling tested from frontend

## Performance Validation

- [ ] Lambda cold start time acceptable (< 5s)
- [ ] API response time acceptable (< 3s)
- [ ] DynamoDB read/write capacity sufficient
- [ ] No throttling errors under normal load

## Troubleshooting Completed

Common issues checked:
- [ ] Lambda timeout errors resolved
- [ ] DynamoDB permission errors resolved
- [ ] CORS errors resolved
- [ ] API Gateway integration errors resolved
- [ ] Environment variable issues resolved

## Rollback Plan

Document rollback procedure:
- [ ] Previous Lambda versions tagged
- [ ] DynamoDB backup created
- [ ] API Gateway previous stage available
- [ ] Rollback steps documented

## Sign-Off

- [ ] Backend developer tested: _________________ Date: _______
- [ ] Frontend developer tested: ________________ Date: _______
- [ ] API documentation reviewed: _______________ Date: _______
- [ ] Deployment approved: ______________________ Date: _______

## Quick Test Commands

```bash
# Test submit complaint
curl -X POST $API_BASE_URL/complaints \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Test","village":"Rampur"}'

# Test get complaints
curl $API_BASE_URL/complaints

# Test get stats
curl $API_BASE_URL/stats

# Check Lambda logs
aws logs tail /aws/lambda/gramvaani-process-voice --follow

# Check DynamoDB item count
aws dynamodb scan --table-name gramvaani-complaints --select COUNT
```

## Support Contacts

- Backend Developer: _______________________
- AWS Account Owner: _______________________
- Frontend Developer: ______________________

## Notes

Additional deployment notes:
_____________________________________________
_____________________________________________
_____________________________________________

---

**Deployment Status**: [ ] Not Started [ ] In Progress [ ] Complete [ ] Verified

**Deployment Date**: _______________
**Deployed By**: _______________
