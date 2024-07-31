import { Fragment } from "react"
import Form from "./Form/Form"
function Login({sendUserData}) {
 
  return (
    <Fragment>
       <Form type="login" sendUserData={sendUserData}/>
    </Fragment>
  )
}

export default Login