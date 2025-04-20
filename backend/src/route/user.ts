import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify} from 'hono/jwt'


export const userRouter= new Hono<{
    Bindings:{
      DATABASE_URL:string
      JWT_SECRET:string
    }
    }>();

userRouter.post('/signup',async(c) =>{

const prisma=new PrismaClient({     //initialising the prisma client
  datasourceUrl:c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body =await c.req.json()    //getting the body of the request 
 
try{
  const user=await prisma.user.create({ //creating a new user
    data:{
      email:body.email,
      password:body.password,
    }
  })
  const token=await sign({id:user.id},c.env.JWT_SECRET)     //creating jwt token
  return c.json({jwt:token})  // returning it
}

catch(e){
  c.status(411)
  return c.text("user already exists")
}


  
})


userRouter.post('/signin', async(c) => {
 
    const prisma=new PrismaClient({     
      datasourceUrl:c.env?.DATABASE_URL,}).$extends(withAccelerate())
  
      const body=await c.req.json();
      try{
        const user=await prisma.user.findUnique({   //finding the unique user
          where:{
            email:body.email,
          }
        })
        if(!user){        //if user not found
          c.status(400);
          return c.json({error:"user not found"})
        }
        
        const jwt=await sign({id:user.id},c.env.JWT_SECRET) //else return the token to the user
        return c.json({jwt:jwt})
  
      }
      catch(e){
        c.status(400)
        return c.json({error:"user not found"})
      }
     
     
    })
  