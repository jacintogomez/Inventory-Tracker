'use client';
import {useState,useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box,Grid,Typography} from '@mui/material';
import {collection,getDocs,query} from 'firebase/firestore';

export default function InventoryPage(){
    const [inventory,setinventory]=useState([]);
    useEffect(()=>{
        const fetchinventory=async()=>{
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
        };
        fetchinventory();
    },[]);

    return (
        <Box
            width='100vw'
            height='100vh'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            padding={4}
        >
            <Typography variant='h4' gutterBottom>All Inventory Items</Typography>
            <Grid container spacing={2} width='80%'>
                {inventory.map(({name,quantity})=>(
                    <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                        <Box
                            border='1px solid #333'
                            padding={2}
                            borderRadius={4}
                            textAlign='center'
                        >
                            <Typography variant='h5'>{name.charAt(0).toUpperCase()+name.slice(1)}</Typography>
                            <Typography variant='body1'>Quantity: {quantity}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}