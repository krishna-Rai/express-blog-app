const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const app = express()

const PORT = 3000

app.listen(PORT,()=>{
    console.log("The server is running at port:",PORT)
})
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'))
//template engine or view engine
app.set('view engine','ejs')

// app.use((req,res,next)=>{
//     console.log("Inside the logging middleware")
//     console.log("New Request:")
//     console.log("Host:",req.hostname)
//     console.log("Path:", req.path)
//     console.log("Method: ", req.method)
//     next()
// })

// app.use((req,res,next)=>{
//     console.log("In the next middleware after logging middleware")
//     next()
// })
app.get('/',(req,res)=>{
    res.redirect('/blogs')
})

app.get('/blogs', (req,res)=>{
    fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
        if(err){
            console.log("Error in reading blog data")
            return
        }
        const blogs = JSON.parse(blogData)
        res.render('index',{
            title: "HomePage",
            blogs
        })
    })
    
})
app.get('/blogs/create', (req,res)=>{
    res.render('create', {
        title: "Create new Blog"
    })
})
app.get('/blogs/:id',(req,res)=>{
    const id = req.params.id
    fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
        if(err){
            console.log("Error in reading blog data")
            return
        }
        let blogs = JSON.parse(blogData)
        blogs = blogs.filter((blog)=>blog.id == id)
        if(blogs.length>0){
            res.render('details',{
                title:"Blog Details Page",
                blog:blogs[0]
            })
        }else{
            res.render('404',{title:"404"})
        }
    })
})


app.post('/blogs/create',(req,res)=>{
    console.log(req.body)
    const newBlog = {
        id:uuidv4(),
        title:req.body.title,
        snippet: req.body.snippet,
        body: req.body.body
    }
    fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
        if(err){
            console.log("Error in reading blog data")
            return
        }
        const blogs = JSON.parse(blogData)
        blogs.push(newBlog)
        fs.writeFile('./db/blogs.json',JSON.stringify(blogs),(err)=>{
            if(err){
                console.log("Error updating the blogs data")
            }else{
                console.log("Successfully update the blogs data")
            }
            res.redirect('/blogs')
        })
    })
})

app.delete('/blogs/:id',(req,res)=>{
    const id = req.params.id
    fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
        if(err){
            console.log("Error in reading blog data")
            return
        }
        let blogs = JSON.parse(blogData)
        blogs = blogs.filter((blog)=>blog.id != id)
        fs.writeFile('./db/blogs.json',JSON.stringify(blogs),(err)=>{
            if(err){
                console.log("Error updating the blogs data")
            }else{
                console.log("Successfully update the blogs data")
            }
            res.redirect('/blogs')
        })
    })
})


app.get('/about', (req,res)=>{
    res.render('about', {
        title: 'About Page'
    })
})
app.get('/about-us', (req,res)=>{
    res.redirect('/about')
})
app.use((req,res)=>{
    res.status(404).render('404',{title:"404"})
})

