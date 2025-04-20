import axios from "axios"
import { ChangeEvent, ChangeEventHandler, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const Auth=({type}:{type:"signup" | "signin"})=>{

    const navigate=useNavigate()
    const [postInput,setpostInput]=useState<SignInput>({
        name:"",
        email:"",
        password:""
    })

    async function sendRequest(){
        try{
        const response=await axios.post('${BACKENED_URL}/api/v1/user/${type==="signup"?"signup":"signin"}',postInput)
        const jwt=response.data
        localStorage.setItem("token",jwt)
        navigate("/blogs")
        }
        catch(e){
            alert("Error signing in")
        }
    }
    return(
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>  
                    <div className="text-3xl font-bold ">
                         Create an account
                    </div>
                    
                    <div className="">
                        {type==="signin"?"Dont have an account":"Already have an account"}
                        <Link className="pl-2 underlined" to={type==="signin"?"/signin":"/signup"}>{type==="signin"?"Sign up":"Sign in"}</Link>
                    </div>
                    </div>
                    <div className="pt-8">
                   {type==="signup"?<LabelledInput label="Name" placeholder="John Doe" onChange={(e)=>{
                        setpostInput({
                            ...postInput,
                            name:e.target.value
                        })
                    }}/>:null}
                    <LabelledInput label="Username" placeholder="JohnnyDoe" onChange={(e)=>{
                        setpostInput({
                            ...postInput,
                            email:e.target.value
                        })
                    }}/>
                    <LabelledInput label="Password" type={"password"} placeholder="" onChange={(e)=>{
                        setpostInput({
                            ...postInput,
                            password:e.target.value
                        })
                    }}/>
                    <button onClick={sendRequest}type="button" className="w-full text-white bg-gray-500 hover">{type==="signup"? "Sign up":"Sing in"}</button>

                    
                    </div>
        </div>
        </div>
    )
}

interface LabelledInputType{
    label:string,
    placeholder:string,
    type?:string,
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void
}


function LabelledInput({label,type,placeholder,onChange}:LabelledInputType){
    return(

        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
             <input onChange={onChange} type={type||"text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
  </div>
        
    )
}