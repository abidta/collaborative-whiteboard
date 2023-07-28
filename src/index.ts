import express, { Application } from 'express'
import {engine} from 'express-handlebars'
import logger from 'morgan'
import { Server } from "socket.io";
import {createServer} from 'http'

const app:Application= express()
const server= createServer(app)
const io= new Server(server)

app.use(logger('dev'))
app.use(express.static('./public'))
//vie engine setup
app.engine('.hbs',engine({extname:'.hbs',defaultLayout:false}))
app.set('views','./views')
app.set('view engine','hbs')



app.get('/',(req,res)=>{
	res.render('index')
})
server.listen(3000,()=>{
	console.log('server running')
	
})

