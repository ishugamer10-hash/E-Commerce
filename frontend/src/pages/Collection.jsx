import React, {useContext,useEffect,useState}from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
const Collection = () => {
  const {products,search, showSearch}= useContext(ShopContext);
  const [showFilter,setshowFilter]=useState(false);
 const [FilterProducts, setFilterProducts]=useState([])
const [category,setCategory]=useState([])
const[subcategory,setSubCategory]=useState([])
const [sortType,setSortType]=useState('relevant');
 
 const toggleCategory=(e)=>{
  if(category.includes(e.target.value)){
setCategory(prev=>prev.filter(item=>item!==e.target.value))
  }
  else{
    setCategory(prev=>[...prev,e.target.value])
  }
 }

 const toggleSubCategory=(e)=>{
  if(subCategory.includes(e.target.value)){
setSubCategory(prev=>prev.filter(item=>item!==e.target.value))
  }
  else{
    setSubCategory(prev=>[...prev,e.target.value])
  }
 }

 const applyFilters=()=>{
  let productsCopy=products.slice();
if (showSearch&& search){
  productsCopy=productsCopy.filter(item=>item.name.tolowercase().includes(search.tolowercase()))
}

  if (category.length>0){
    productsCopy=productsCopy.filter(item=>category.include(item.category));
  }

  if (subCategory.length>0){
    productsCopy=productsCopy.filter(item=>subCategory.include(item.category));
  }
  setFilterProducts(productsCopy)
 }

 const sortProducts=()=>{
  let fpCopy=FilterProducts.slice();
   switch(sortType){
    case 'low-high':
    setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)))
   break;

    case 'high-low':
    setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)))
   break;

    defaut:
    applyFilters()
    break;
  


}
  useEffect(()=>{
    sortProducts()
  },[sortType])

  useEffect(()=>{
    applyFilters()
  },[category,subCategory,search,showSearch,products])


  // useEffect(()=>{
  //   console.log(category)
  // },[category])
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <div className='min-w-60'>
        <p onClick={()=>setshowFilter(!showFilter)}  className='my-2 text-xl flex item-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter? 'rotate-90':''}`} src={assets.dropdown_icon} alt="" />
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter? '' : 'hidden'}`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className='flex gap-2'>
            <input className='w-3' type="checkbox"  value={'MEN'}/>MEN
          </p>
           <p className='flex gap-2'>
            <input className='w-3' type="checkbox"  value={'WOMEN'}/>WOMEN
          </p>
           <p className='flex gap-2'>
            <input className='w-3' type="checkbox"  value={'KIDS'}/>KIDS
          </p>
        </div>
        </div>

   <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter? '' : 'hidden'}`}>
          <p className='mb-3 text-sm font-medium'>TYPES</p>
        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className='flex gap-2'>
            <input className='w-3' type="checkbox"  value={'Topwear'} onChange={toggleSubCategory}/>Topwear
          </p>
           <p className='flex gap-2'>
            <input className='w-3' type="checkbox"  value={'Bottomwear'} onChange={toggleSubCategory}/>Bottomwear
          </p>
           <p className='flex gap-2'>
            <input className='w-3' type="checkbox"  value={'Winterwear'}onChange={toggleSubCategory}/>Winterwear
          </p>
        </div>
        </div>

         <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'All'} text2={'Collections'}   ></Title>
          <select className='border-2 border-gray-300 text-sm px-2'>
            <option onChange={(e)=>setSortType(e.target.value)} value="relevant">sort by: relevant</option>
            <option value="low-high">sort by: low to high</option>
            <option value="high-low">sort by: high to low</option>

          </select>
         </div>
         <div className='grid grid-cols-2 md:grid-cols-3 lg:gfrid-cols-4 gap-4 gap-y-6'>
          {
          FilterProducts.map((item,index)=>{
            <ProductItem key={index} name={item.name} id={item._id} price={item.price } image={item.image } />
           })
          }
         </div>
        </div>
      
    </div>
  )
}}

export default Collection
