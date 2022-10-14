const  {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()
const wait=(time)=>{
    const date=Date.now()
    while (Date.now()<date+time) {}
}
module.exports.TodosModel=class{
    static async  getTodos(){return await prisma.todos.findMany()}
    static async  getTodosCompleted(){return await prisma.todos.findMany({where:{completed:true}})}
    static async  getTodosActived(){return await prisma.todos.findMany({where:{completed:false}})}
    static async toggleCompleted(id){
        wait(1000)
        const todo=await prisma.todos.findUnique({where:{id}})
        if(todo){
            return await prisma.todos.update({where:{id:todo.id},data:{completed:!todo.completed}})
        }
        return todo
    }
    static async deleteTodo(id){
        return await prisma.todos.delete({where:{id}})
    }
    static async createTodo(task,completed=false) {
        const todo=await prisma.todos.create({data:{task,completed,date:new Date()}})
        return todo
    }
}