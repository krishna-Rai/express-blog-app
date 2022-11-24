const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const connectToDb = require('./db/connection')
const ObjectId = require('mongodb').ObjectId

const app = express()

const PORT = 3000
const dbName = 'blog';
let blogPosts
connectToDb()
  .then((client)=>{
    const db = client.db(dbName);
    blogPosts = db.collection('blog-posts');
    app.listen(PORT,()=>{
        console.log("The server is running at port:",PORT)
    })
  })
  .catch(console.error)
app.use(express.json())
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

app.get('/blogs', async (req,res)=>{
    // fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
    //     if(err){
    //         console.log("Error in reading blog data")
    //         return
    //     }
    //     const blogs = JSON.parse(blogData)
    //     res.render('index',{
    //         title: "HomePage",
    //         blogs
    //     })
    // })
    let blogs = await blogPosts.find({}).toArray()
    blogs = blogs.map((blog)=>{
        blog._id = blog._id.toString()
        return blog
    })
    console.log(blogs)
    res.render('index',{
        title: "HomePage",
        blogs
    })
})
app.get('/blogs/create', (req,res)=>{
    res.render('create', {
        title: "Create new Blog"
    })
})
app.get('/blogs/update/:id', async (req,res)=>{
    const id = req.params.id
    // fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
    //     if(err){
    //         console.log("Error in reading blog data")
    //         return
    //     }
    //     let blogs = JSON.parse(blogData)
    //     blogs = blogs.filter((blog)=>blog.id == id)
    //     if(blogs.length>0){
    //         res.render('update', {
    //             title: "Update Blog",
    //             blog: blogs[0]
    //         })
    //     }else{
    //         res.render('404',{title:"404"})
    //     }
    // })
    const blog = await blogPosts.findOne({_id :new ObjectId(id)})
    blog._id = blog._id.toString()
    if(blog){
        res.render('update', {
            title: "Update Blog",
            blog
        })
    }else{
        res.render('404',{title:"404"})
    }
    
})
app.get('/blogs/:id', async(req,res)=>{
    const id = req.params.id
    console.log(id)
    // fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
    //     if(err){
    //         console.log("Error in reading blog data")
    //         return
    //     }
    //     let blogs = JSON.parse(blogData)
    //     blogs = blogs.filter((blog)=>blog.id == id)
    //     if(blogs.length>0){
    //         res.render('details',{
    //             title:"Blog Details Page",
    //             blog:blogs[0]
    //         })
    //     }else{
    //         res.render('404',{title:"404"})
    //     }
    // })
    const blog = await blogPosts.findOne({_id:new ObjectId(id)})
    console.log(blog)
    if(blog){
        res.render('details',{
            title:"Blog Details Page",
            blog
        })
    }else{
        res.render('404',{title:"404"})
    }
})


app.post('/blogs/create',async(req,res)=>{
    console.log(req.body)
    const newBlog = {
        title:req.body.title,
        snippet: req.body.snippet,
        body: req.body.body
    }
    // fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
    //     if(err){
    //         console.log("Error in reading blog data")
    //         return
    //     }
    //     const blogs = JSON.parse(blogData)
    //     blogs.push(newBlog)
    //     fs.writeFile('./db/blogs.json',JSON.stringify(blogs),(err)=>{
    //         if(err){
    //             console.log("Error updating the blogs data")
    //         }else{
    //             console.log("Successfully update the blogs data")
    //         }
    //         res.redirect('/blogs')
    //     })
    // })
    const insertedPost = await blogPosts.insertOne(newBlog)
    res.redirect('/blogs')
})

app.delete('/blogs/:id', async (req,res)=>{
    const id = req.params.id
    // fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
    //     if(err){
    //         console.log("Error in reading blog data")
    //         return
    //     }
    //     let blogs = JSON.parse(blogData)
    //     blogs = blogs.filter((blog)=>blog.id != id)
    //     fs.writeFile('./db/blogs.json',JSON.stringify(blogs),(err)=>{
    //         if(err){
    //             console.log("Error updating the blogs data")
    //         }else{
    //             console.log("Successfully update the blogs data")
    //         }
    //         // res.redirect('/blogs')
    //         res.json({redirect:'/blogs'})
    //     })
    // })
    const deletedPost = await blogPosts.deleteOne({_id:new ObjectId(id)})
    res.json({redirect:'/blogs'})

})

app.put('/blogs/:id',async (req,res)=>{
    const id = req.params.id
    console.log("Inside put")
    console.log(req.body)
    const updatedBlog = {
        title:req.body.title,
        snippet:req.body.snippet,
        body:req.body.body
    }
    // fs.readFile('./db/blogs.json', 'utf-8', (err,blogData)=>{
    //     if(err){
    //         console.log("Error in reading blog data")
    //         return
    //     }
    //     let blogs = JSON.parse(blogData)
    //     blogs.forEach(blog=>{
    //         if(blog.id == id){
    //             blog.title = req.body.title
    //             blog.snippet = req.body.snippet
    //             blog.body = req.body.body
    //         }
    //     })
    //     console.log(blogs)
    //     fs.writeFile('./db/blogs.json',JSON.stringify(blogs),(err)=>{
    //         if(err){
    //             console.log("Error updating the blogs data")
    //         }else{
    //             console.log("Successfully update the blogs data")
    //         }
    //         // res.redirect('/blogs')
    //         res.json({redirect:`/blogs/${id}`})
    //     })
    // })

    const updatedPost = await blogPosts.updateOne({_id:new ObjectId(id)},{$set:updatedBlog})
    res.json({redirect:`/blogs/${id}`})

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

