import express from "express";

const app = express();
const port = 4000


app.use(express.json())

app.get("/" , (req, res)=>{
    res.json({
        msg : "hello from express backend"
    })
})

app.post("/api/user/name" , async(req, res)=>{
    const body = await req.body
})

app.listen(port , ()=>{
    console.log(`express backend running on port ${port}`)
})