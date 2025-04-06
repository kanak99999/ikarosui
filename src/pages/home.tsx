import { useState } from 'react';
import nookies from 'nookies';
export default function HomePage() {
    return (
      <div>

        <div style={{ fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', borderRight: '2px solid', animation: 'typing 3s steps(30, end), blink-caret 0.5s step-end infinite' }}>
          Welcome to IKAROS!!!!!!
          <style jsx>{`
            @keyframes typing {
              from {
                width: 0;
              }
              to {
                width: 100%;
              }
            }
            @keyframes blink-caret {
              from, to {
                border-color: transparent;
              }
              50% {
                border-color: black;
              }
            }
          `}</style>
        </div>
        
      </div>
    );
  }

  export async function getServerSideProps(context:any){
    const cookies = nookies.get(context);
    const token = cookies.accessToken || null;
    console.log("MyAccessToken: "+ token);
    // if(token)
    // {
    //   return {props:{}}
    // }
    // else
    // {
    //   return {
    //     redirect:{
    //       destination:'/login',
    //       permanent: false
    //     }
    //   }
    // }
    return {props:{}}
  }