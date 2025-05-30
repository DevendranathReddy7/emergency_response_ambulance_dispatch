import Input from "../../common/Input"

const Dashboard: React.FC = () => {
    const changeHandler =()=>{
        
    }
    return (
        <div>
            <Input type="text" name='person' placeholder="Hi" changeHandle={changeHandler} value={'new'} id='nje' datatestid='nje' errorMessage='k21wel'/>
        </div>
    )
}

export default Dashboard