import React, { useRef } from 'react'
import Signature from 'react-signature-canvas'

function SignatureCanvas(){

    const sigCanvas = useRef(null);

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    return(
        <div>
            <Signature
                ref={sigCanvas}
                penColor='green'
                canvasProps={{ width: 500, height: 200 }}
            />
            <button onClick={clearSignature}>Limpar</button>
        </div>
    )
}

export default SignatureCanvas