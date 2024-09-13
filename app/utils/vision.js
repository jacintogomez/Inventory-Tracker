import * as dotenv from 'dotenv';
dotenv.config();
import {OpenAI} from 'openai';

export default async function GenerateSugg(image){
    const openai=new OpenAI();
    const response=await openai.chat.completions.create({
        model:'gpt-4o',
        messages:[
            {
                role:'user',
                content:[
                    {
                        type:'text',
                        text:'Find the most prominent object in the image and say what it is in as few words as possible; just giving the name of whatever object it is',
                    },
                    {
                        type:'image_url',
                        image_url:{
                            url:'https://thechatwalny.agencydominion.net/uploads/2024/06/Chrysler-building-1-1024x1024.jpg',
                            detail:'low',
                        },
                    },
                ],
            }
        ]
    });

    console.log(response.choices[0]);
    return response.choices[0];
}