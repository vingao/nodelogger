var FileStreamRotator = require('file-stream-rotator')
var express = require('express')
var morgan = require('morgan')
var uuid = require('node-uuid')
var bodyParser = require('body-parser')
var logDirectory = __dirname + '/log'

morgan.token('id', function getId(req) {
    return req.id
})

// my request length
morgan.token('request-length', function getReqLength(req) {
    return req.reqlength;
})

var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(assignReqLength);

app.use(assignId)

var perfLogStream = FileStreamRotator.getStream({
    //filename: logDirectory + '/perf-%DATE%.log',
    filename: logDirectory + '/perf-'+process.pid+'.log',
    //frequency: 'daily',  // broken: https://github.com/holidayextras/file-stream-rotator/issues/9
    //frequency: '1h',
    verbose: false,
    date_format: 'YYYYMMDD'
})

//app.use(morgan(':id :method :url :request-length :status :res[content-length] :response-time'))
//app.use(morgan(':date[iso] :id :method :url :request-length :status :res[content-length] :response-time', {stream: perfLogStream}))
app.use(morgan(':date[iso] :method :url :request-length :status :res[content-length] :response-time', {stream: perfLogStream}))

app.get('/', function (req, res) {
    res.send('hello, world!')
})

app.post('/', function (req, res) {
    res.send('hello, world!')
})

function assignReqLength(req, res, next) {
    req.reqlength = req.headers['content-length'] ? parseInt(req.headers['content-length'], 10) : null;
    next();
}


function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
}


app.listen(3000);