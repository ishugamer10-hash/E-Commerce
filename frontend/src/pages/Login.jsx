import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const [currentState, setCurrentState]=useState('Login')
  const[token, setToken, navigate,backendUrl]=useContext(ShopContext)

  const[name,setName]=useState('')
  const[password,setPassword]=useState('')
  const[email,setEmail]=useState('')



  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    try{
      if (currentState==='Sign Up') {
        const response=await axios.post(backendUrl+'/api/user,register',{user, email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
        }
      else{
             toast.error(response.data.message)
      }
     } else{
       const response=await axios.post(backendUrl+'/api/user,register',{ email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
        }
      else{
             toast.error(response.data.message)
      }
      }
    }catch(error){
      console.log(error);
      toast.error(error.message)
      
    }
    }
    useEffect(()=>{
      getProdutsData()
    } ,
    [])

    useEffect(()=>{
       if(!token&& localStorage.getItem('token')){
        setToken(localStorage.getItem('token'))
       }
    },[])
  
  return (
    <form onSubmit={onSubmitHandler } className='flex flex-col item-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex mt-10 item-center gap-2 mb-2'>
        <p className='prata-regular text-3xl '>{currentState}
          
        </p>
        <hr className='border-none h-[1.5px] w-8 border-gray-800' />
      </div>
      
     {currentState==='login'?'': <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name'  required/>}
        <input onChange={(e)=>setName(e.target.value)} value={email}  type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email'  required/>
          <input onChange={(e)=>setName(e.target.value)} value={password}  type='password' className='w-full px-3 py-2 border border-gray-800' placeholder='Password'  required/>
          <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer'>Forgot your Password?</p>
            {
              currentState==='login' 
              ? <p onClick={()=>setCurrentState('Sign Up')}>Create account</p>
              : <p onClick={()=>setCurrentState('Login')}>Login Here</p>
              
            }
          </div>
          <button className='bg-black text-white font-white px-8 py-2 mt-4' >{currentState==='login'?'':'Sign Up' } </button>
    </form>
  )
}

export default Login
