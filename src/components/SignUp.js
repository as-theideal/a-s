import Form from './Form/Form'
import { Fragment } from "react"
function SignUp({sendUserData}) {
 
  return (
    <Fragment>
       <Form type="signup" sendUserData={sendUserData}/>
    </Fragment>
  )
}

export default SignUp