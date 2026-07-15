"use client";

import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Image,
} from "lucide-react";


import {
  useEffect,
  useState,
} from "react";



type Item = {

  title:string;

  description:string;

  icon:any;

  command:string;

};



type Props = {

  items:Item[];

  command:(item:Item)=>void;

};





export default function SlashMenu({

  items,

  command,

}:Props){



  const [selected,setSelected] =
    useState(0);



  useEffect(()=>{


    function keyDown(
      event:KeyboardEvent
    ){


      if(event.key==="ArrowDown"){

        event.preventDefault();

        setSelected(
          value =>
          value + 1 >= items.length
          ?
          0
          :
          value + 1
        );

      }




      if(event.key==="ArrowUp"){

        event.preventDefault();


        setSelected(
          value =>
          value - 1 < 0
          ?
          items.length - 1
          :
          value - 1
        );

      }





      if(event.key==="Enter"){

        event.preventDefault();


        command(
          items[selected]
        );

      }



    }


    window.addEventListener(
      "keydown",
      keyDown
    );


    return ()=>{

      window.removeEventListener(
        "keydown",
        keyDown
      );

    };


  },[
    items,
    selected,
    command
  ]);






  return (

    <div
      className="
      w-80
      rounded-xl
      border
      bg-background
      p-2
      shadow-xl
      "
    >



      {
        items.length === 0
        ?

        <div
          className="
          p-3
          text-sm
          text-muted-foreground
          "
        >

          No commands found

        </div>

        :


        items.map(
          (item,index)=>(


          <button

          key={item.title}


          onClick={()=>
            command(item)
          }


          className={`
          flex
          w-full
          items-center
          gap-3
          rounded-lg
          px-3
          py-2
          text-left
          transition

          ${
            selected === index
            ?
            "bg-muted"
            :
            "hover:bg-muted"
          }

          `}

          >



            <item.icon
              className="
              h-5
              w-5
              "
            />



            <div>


              <div
              className="
              text-sm
              font-medium
              "
              >

                {item.title}

              </div>



              <div
              className="
              text-xs
              text-muted-foreground
              "
              >

                {item.description}

              </div>


            </div>



          </button>


          )

        )


      }



    </div>

  );

}