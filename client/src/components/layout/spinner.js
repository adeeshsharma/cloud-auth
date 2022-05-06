import React, {Fragment} from 'react';
import spinner from './spinner.gif';

export default() =>(
    <Fragment>
        <center>
        <img className='spinner' src={spinner} style={{width:'200px', margin:'auto', display:'flex'}} alt='Loading...' />
        </center>
    </Fragment>
)