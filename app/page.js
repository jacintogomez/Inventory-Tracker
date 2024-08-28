'use client';
import {useState,useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box,Modal,Stack,TextField,Button,Typography} from '@mui/material';
import {collection,getDocs,query,getDoc,doc,deleteDoc,setDoc} from 'firebase/firestore';

export default function Home(){
  const [inventory,setinventory]=useState([]);
  const [open,setopen]=useState(false);
  const [itemname,setitemname]=useState('');
  const [schquery,setschquery]=useState('');

  const updateInventory=async()=>{
    const snapshot=query(collection(firestore,'pantry'));
    const docs=await getDocs(snapshot);
    const inventorylist=[];
    docs.forEach((doc)=>{
      inventorylist.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setinventory(inventorylist);
  }

  const addItem=async(item)=>{
    const docref=doc(collection(firestore,'pantry'),item);
    const docsnap=await getDoc(docref);
    if(docsnap.exists()){
      const {quantity}=docsnap.data();
      await setDoc(docref,{quantity:quantity+1});
    }else{
      await setDoc(docref,{quantity:1})
    }
    await updateInventory();
  }

  const removeItem=async(item)=>{
    const docref=doc(collection(firestore,'pantry'),item);
    const docsnap=await getDoc(docref);
    if(docsnap.exists()){
      const {quantity}=docsnap.data();
      if(quantity===1){await deleteDoc(docref);}
      else{await setDoc(docref,{quantity:quantity-1});}
    }
    await updateInventory();
  }

  useEffect(()=>{updateInventory()},[])
  const handleopen=()=>setopen(true);
  const handleclose=()=>setopen(false);
  const filteredinventory=inventory.filter(({name})=>name.toLowerCase().includes(schquery.toLowerCase()));

  return (
    <Box
        width='100vw'
        height='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        gap={2}
    >
      <Modal open={open} onClose={handleclose}>
        <Box
          position='absolute'
          top='50%'
          left='50%'
          width={500}
          border='2px solid #000'
          bgcolor='white'
          boxShadow={24}
          p={4}
          display='flex'
          flexDirection='column'
          gap={3}
          sx={{transform:'translate(-50%,-50%)'}}
        >
          <Typography variant='h6'>Add item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField
                variant='outlined'
                fullWidth
                value={itemname}
                onChange={(e)=>{setitemname(e.target.value)}}
            ></TextField>
            <Button
                variant='outlined'
                onClick={()=>{
                  addItem(itemname);
                  setitemname('');
                  handleclose();
                }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant='contained' onClick={()=>{handleopen();}}>Add New Item</Button>
      <Box border='1px solid #333' borderRadius='10px'>
        <Box width='800px' height='100px' bgcolor='#ADD8E6' display='flex' justifyContent='space-around' alignItems='center' borderRadius='10px'>
          <Typography variant='h2' color='#333'>Inventory Items</Typography>
          <TextField
              id='outlined-basic'
              label='Search'
              variant='outlined'
              value={schquery}
              onChange={(e)=>setschquery(e.target.value)}
          />
        </Box>
        <Stack width='800px' height='300px' spacing={2} overflow='auto'>
          {filteredinventory.map(({name,quantity})=>(
            <Box key={name} width='100%' minHeight='150px' display='flex' alignItems='center' justifyContent='space-between' bgcolor='#f0f0f0' padding={5}>
              <Typography variant='h3' color='#333' textAlign='center'>
                {name.charAt(0).toUpperCase()+name.slice(1)}
              </Typography>
              <Typography variant='h3' color='#333' textAlign='center'>
                {quantity}
              </Typography>
              <Stack direction='row' spacing={2}>
                <Button variant='contained' onClick={()=>{addItem(name)}}>Add</Button>
                <Button variant='contained' onClick={()=>{removeItem(name)}}>Remove</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}