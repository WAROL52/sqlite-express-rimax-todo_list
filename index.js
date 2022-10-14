const express = require("express");
const res = require("express/lib/response");
const morgan = require("morgan");
const { TodosModel } = require("./models/todos.model");

const getTodo={
    "todo-all":TodosModel.getTodos,
    "todo-completed":TodosModel.getTodosCompleted,
    "todo-active":TodosModel.getTodosActived,
}
const app=express()
const port=8080
app.set("view engine","ejs")
app.listen(port)
app.use(express.json())
app.use(morgan("tiny"))

app.use(express.static("public"))

app.get("/",async (req,res)=>res.render("index",{titre:"Rolio",tabActive:"todo-all"}))
app.get("/api",async (req,res)=>res.json(await getTodo["todo-all"]()))
app.get("/api/:type",async (req,res)=>{
    if(getTodo[req.params.type]){
        return res.json(await getTodo[req.params.type]())
    }
    res.json([])
})
app.put("/api/:type/toggle/:id",async (req,res)=>{
    const todo=await TodosModel.toggleCompleted(Number(req.params.id))
    if(todo&&getTodo[req.params.type]){
        return res.json(await getTodo[req.params.type]())
    }
    res.json([])
})
app.delete('/api/:type/:id',async (req,res)=>{
    const todo=await TodosModel.deleteTodo(Number(req.params.id))
    if(todo&&getTodo[req.params.type]){
        return res.json(await getTodo[req.params.type]())
    }
    res.json([])
})
app.post("/api/:type/add",async (req,res)=>{
    if(req.body.task){
        await TodosModel.createTodo(req.body.task)
    }
    if(getTodo[req.params.type]){
        return res.json(await getTodo[req.params.type]())
    }
    res.json([])
})
app.get("/todo-all",async (_,res)=>res.render("index",{titre:"All",tabActive:"todo-all"}))
app.get("/todo-active",async (_,res)=>res.render("index",{titre:"Active",tabActive:"todo-active"}))
app.get("/todo-completed",async (_,res)=>res.render("index",{titre:"Completed",tabActive:"todo-completed"}))