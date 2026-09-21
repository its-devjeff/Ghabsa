import './Skeleton.css'
export default function Skeleton({type}){
    const COUNTER =3;
const SearchSkeleton=()=>(

    
        <div className='Result-item'>
            <div className='img'></div>
            <div className='Result-info'>
            <h3></h3>
            <p className='course'></p>
            <p className='size'></p>
            <button></button>
             </div>
        </div>
                               
                
    )
if (type === 'Result') return Array(COUNTER).fill(<SearchSkeleton/>);
}

