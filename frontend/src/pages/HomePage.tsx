import React,{useState,useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext';

interface Product{
  id:number;
  description:string;
}

const HomePage: React.FC = () => {
  const [products,setProducts]=useState<Product[]>([]);
  const auth=useContext(AuthContext);
  useEffect(()=>{
    getProducts();
  },[]);

  const getProducts=async ()=>{
    const response=await fetch('http://localhost:8000/api/products',{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(auth?.authTokens?.access)
      }
    });
    const data=await response.json();
    if(response.status === 200){
      setProducts(data);
    }else if(response.statusText === "Unauthorized"){
      auth?.logoutUser();
    }
  }
  return (
    <div>
        <p>Home Page</p>
        <ul>
          {products.map((product)=>(
            <li key={product.id}>{product.description}</li>
          ))}
        </ul>
    </div>
  )
}

export default HomePage