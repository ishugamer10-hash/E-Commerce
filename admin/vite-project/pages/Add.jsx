import React, { useState } from 'react'
import { assets } from '../src/assets/assets'
import axios from 'axios'
import { backendUrl } from '../src/App'
import { toast, ToastContainer } from 'react-toastify'

const[image1,setImage1]=useState(false)
const[image2,setImage2]=useState(false)
const[image3,setImage3]=useState(false)
const[image4,setImage4]=useState(false)

const[name,setName]=useState("");
const[description,setDescription]=useState("");
const[price,setPrice]=useState("");
const[category,setCategory]=useState("Men");
const[subCategory,setSubCategory]=useState("Topwear");
const[bestseller,setBestseller]=useState("false");
const[sizes,setSizes]=useState([]);

const onSubmitHandler=async(e)=>{
  e.preventDefault();
  try {
    const formData=new formData()
    formData.append("name",name)
    formData.append("description",description)
    formData.append("price",price)
    formData.append("category",category)
    formData.append("subCategory",subCategory)
    formData.append("bestseller",bestseller)
    formData.append("sizes",JSON.stringify(sizes))  

  image1 &&  formData.append("image1",image1)
     image2&& formData.append("image2",image2)
     image3&&formData.append("image3",image3)
     image4&& formData.append("image4",image4)

     const response=await axios.post(backendUrl+"/api/product/add",formData,{headers:{token}})
     if (response.data.success) {
      toast.success(response.data.message)
      setName('')
      setDescription('')
      setImage1('false')
       setImage2('false')
        setImage3('false')
         setImage4('false')
         setPrice('')

     }else{
     toast.error(response.data.message)
     }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

const Add = () => {
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full item-start gap-3'>
      <div>
        <p className=' mb-2'>Upload Image</p>
        <div className='flex gap-2'>
        <label htmlFor="image1">
          <img onChange={(e)=>setImage1(e.target.files[0] )} className='w-20'src={image1?assets.upload_area: URL.createObjectURL(image1)} alt="" />
          <input type="file"  id="image1" hidden />
        </label>

        <label htmlFor="image2">
          <img onChange={(e)=>setImage2(e.target.files[0] )} className='w-20' src={image1?assets.upload_area: URL.createObjectURL(image2)} alt="" />
          <input type="file"  id="image2" hidden />
        </label>

        <label htmlFor="image3">
          <img onChange={(e)=>setImage1(e.target.files[0] )}  className='w-20'src={image1?assets.upload_area: URL.createObjectURL(image3)} alt="" />
          <input type="file"  id="image3" hidden />
        </label>

        <label htmlFor="image4">
          <img onChange={(e)=>setImage1(e.target.files[0] )}  className='w-20' src={image1?assets.upload_area: URL.createObjectURL(image4)} alt="" />
          <input type="file"  id="image4" hidden />
        </label>
        </div>
        

      </div>
      
      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e)=> setName(e.target.value)} value={name} className='w-full ,max-w-[500]' px-3 py-2 type="text " placeholder='Type here' required/>
      </div>

 <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e)=> setName(e.target.value)} value={description} className='w-full ,max-w-[500]' px-3 py-2 type="text " placeholder='Write Content' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div >
          <p className='mb-2'>Product Category</p>
          <select onChange={(e)=> setCategory(e.target.value)}  className='w-full px-3 py-2'>
            <option value="Men"></option>
            <option value="Women"></option>
            <option value="Kids"></option>
          </select>
        </div>

<div >
          <p className='mb-2'> Sub Category</p>
          <select onChange={(e)=> setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear"></option>
            <option value="Bottomwear"></option>
            <option value="Winterwear"></option>
          </select>
        </div>

<div>
  <p className='mb-2'>Product Price</p>
  <input onChange={(e)=> setPrice(e.target.value)} value={price}  className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
</div>
      </div>
<div>
  <p>Product Sizes</p>
  <div className='flex gap-3'>
    <div onClick={()=>setSizes(prev.includes("S")? prev.filter(item=>item!=="S"):[...prev,"S "])}>
      <p className={`${sizes.include("S")?"bg-pink-100": "bg-slate-200"}px-3 py-1 cursor-pointer`}>S</p>
    </div>

    <div  onClick={()=>setSizes(prev.includes("M")? prev.filter(item=>item!=="M"):[...prev,"M "])}>
      <p className={`${sizes.include("M")?"bg-pink-100": "bg-slate-200"}px-3 py-1 cursor-pointer`}>M</p>
    </div>
    <div onClick={()=>setSizes(prev.includes("L")? prev.filter(item=>item!=="L"):[...prev,"L "])}>
      <p className={`${sizes.include("L")?"bg-pink-100": "bg-slate-200"}px-3 py-1 cursor-pointer`}>L</p>
    </div>
    <div onClick={()=>setSizes(prev.includes("xL")? prev.filter(item=>item!=="xL"):[...prev,"xL "])}>
      <p className={`${sizes.include("xL")?"bg-pink-100": "bg-slate-200"}px-3 py-1 cursor-pointer`}>xl</p>
    </div>
    <div onClick={()=>setSizes(prev.includes("xxL")? prev.filter(item=>item!=="xxL"):[...prev,"xxL "])}>
      <p className={`${sizes.include("xxL")?"bg-pink-100": "bg-slate-200"}px-3 py-1 cursor-pointer`}>xxl</p>
    </div>
  </div>
</div>

<div flex gap-2 mt-2>
  <input onChange={()=>setBestseller(prev =>!prev)} checked={bestseller} type="checkbox" name="" id="bestseller" />
<label className='cursor-pointer' htmlFor="bestseller" > Add to bestseller</label>
</div>
<button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>Add</button>
    </form>
  )
}

export default Add
