'use client';
import Image from 'next/image';
import {useState,useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box,Modal,Stack,TextField,Button,Typography} from '@mui/material';
import {collection,getDocs,query} from 'firebase/firestore';

export default function Home(){
  const [inventory,setinventory]=useState([]);
  const [open,setopen]=useState(false);
  const [itemname,setitemname]=useState([]);

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
                  additem(itemname);
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
      <Box border='1px solid #333'>
        <Box width='800px' height='100px' bgcolor='ADD8E6' display='flex' justifyConcent='center' alignItems='center'>
          <Typography variant='h2' color='#333'>Inventory Items</Typography>
        </Box>
      </Box>
      <Stack width='800px' height='800px' spacing={2} overflow='auto'>
        {
          inventory.map(({name,quantity})=>{
            <Box key={name} width='100%' minHeight='150px' display='flex' alignItems='center' justifyContent='center' bgColor='#f0f0f0' padding={5}>
              <Typography>{name}</Typography>
            </Box>
          })
        }
      </Stack>
    </Box>
  );
}