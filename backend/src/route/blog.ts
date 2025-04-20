import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify} from 'hono/jwt'
import { auth } from 'hono/utils/basic-auth';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();



blogRouter.use('/*', async(c,next) =>{    //middleware for all the routes

        const header= c.req.header("Authorization") ||""   //getting the header of request
          
       // const token=header.split(" ")[1]    // getting the toke as it is Bearer token so we split it into [Bearer,token]
          
        const user= await verify(header,c.env.JWT_SECRET)    //verifying the token
      
        if(user){      //if the token is verified move to the next 
          c.set("userId", String(user.id));//set the userId in the context
          await next()
        }
        else{
          c.status(403)
          return c.json({error:"auth failed"})
        }
        })
      




 blogRouter.get('/bulk',async(c)=>{
   const prisma=new PrismaClient({datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
     const blogs=prisma.post.findMany();
        return c.json({
          blogs
          })
        
        })
        


blogRouter.get('/:id', async(c) => {     //get the blog y id
  const id=await c.req.param("id");
    const prisma=new PrismaClient({datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())

    try{
      const blog=await prisma.post.findFirst({
        where:{
          id: (id),
        }})
      return c.json({
        blog
      })     
    }
    catch(e){
      return c.json({error: "blog not found"})
    }
   
 

})


blogRouter.post('/', async (c) => {
    const body=await c.req.json();
    const prisma=new PrismaClient({datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
    const userId=c.get("userId"); //userId as the key in set is used
    
    const blog=await prisma.post.create({
        data:{
           title:body.title,
           content:body.content,
           authorid:userId,


        }
    })
    return c.json({
      id:blog.id,
    })
})


blogRouter.put('/', async(c) => {    //updates the blog
  const body=await c.req.json();
  const prisma=new PrismaClient({datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())

  
  const blog=await prisma.post.update({
    where:{
      id:body.id,
    },
      data:{
         title:body.title,
         content:body.content,
      

      }
  })
  return c.json({
    id:blog.id,
  })
  
})
