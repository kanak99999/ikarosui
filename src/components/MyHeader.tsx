import ikaroslogo from '../assets/ikaros-logo.png';
import Image from 'next/image';
function MyHeader(){
    return(
        <>
            <div>
                <span>
                    <img src={ikaroslogo.src} height="50px" width="100px" style={{margin:'10px'}}></img>
                </span>
            </div>
        </>
    );
}
export default MyHeader;