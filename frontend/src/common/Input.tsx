import type { inputProps } from "../dataModals/Common"

const Input: React.FC<inputProps> = ({ type,name, placeholder,changeHandle, value, id, datatestid, errorMessage }) => {
    return (
        <div className="w-full sm:w-[40%] mb-3 sm:mb-0">
            <input name={name} className="border-2 border-style-solid rounded-md h-15 w-full" type={type} placeholder={placeholder} onChange={changeHandle} value={value} id={id} data-testid={datatestid}/>
            {errorMessage && <p className="text-red-500 text-sm mx-auto ">{errorMessage}</p>}
        </div>
    )
}

export default Input