var FileStreamRotator = require('file-stream-rotator')
var express = require('express')
var fs = require('fs')
var morgan = require('morgan')

var app = express()
var logDirectory = __dirname + '/log'

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
    //filename: logDirectory + '/access-%DATE%.log',
    filename: logDirectory + '/access-'+process.pid+'.log',
    //frequency: 'daily',  // broken: https://github.com/holidayextras/file-stream-rotator/issues/9
    //frequency: '1h',
    verbose: false,
    date_format: 'YYYYMMDD'
})

morgan.token('type', function(req, res){ return req.headers['content-type']; })

// setup the logger
app.use(morgan('dev', {stream: accessLogStream}))

app.get('/', function (req, res) {
    res.send('hello, world!')
})

app.listen(3000);