

const Hamburger=({isOpen})=>{
    return(
       <>
        <div className='hamburger'>
              <div className='burger burger-1'/>
              <div className='burger burger-2'/>
              <div className='burger burger-3'/>
            </div>
            <style jsx="true">{`
            .hamburger{
                width:2rem;
                height:2rem;
                display:flex;
                justify-content:space-around;
                flex-flow:column nowrap;
                margin-right:1em;
                z-index:10;
            }
            .burger{
                width:2rem;
                height:0.25rem;
                border-radius:10px;
                background-color:#fff;
                transform-origin:1px;
                transition:all 0.3s linear;
            }
            .hamburger{
                display:none;
            }
            .burger-1{
                transform:${isOpen ? 'rotate(45deg)' : 'rotate(0)'};

            }
            .burger-2{
                transform:${isOpen ? 'translateX(100%)' : 'translateX(0)'};
                opacity:${isOpen ? 0 : 1}
            }
            .burger-3{
                transform:${isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
            }

            @media (max-width:767px){
                .hamburger{
                    display:flex;
                    box-sizing:border-box;
                    margin-left:150%;
                    margin-right:1%;
                    position:relative;
                    margin-top:30%;
                    z-index:10;
                }


            `}</style>
        </>

    )
    
}
export default Hamburger;