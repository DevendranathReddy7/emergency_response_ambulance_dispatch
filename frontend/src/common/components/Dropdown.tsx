import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';
import type { dropDownProps } from '../../dataModals/Common';

export default function DropDown({ fieldName, name, menuItems, error, helperText, selectHandle, value }: dropDownProps) {
    return (
        <Box >
            <FormControl fullWidth error={error}>
                <InputLabel id={`input__${name}`}>{fieldName}</InputLabel>
                <Select
                    labelId={`dropDown__${name}`}
                    id={`dropDown__${name}`}
                    label={name}
                    value={value}
                    // @ts-ignore
                    onChange={selectHandle}
                    name={name}
                >
                    {menuItems?.map((item: string) => (
                        <MenuItem key={item} value={item} disabled={item.startsWith('Please wait while ') || item.startsWith('Failed to fetch available')}>
                            {item}
                        </MenuItem>))}

                </Select>
                {error && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        </Box>
    );
}

// export default function DropDown({ fieldName, name, menuItems, error, helperText, selectHandle }: dropDownProps) {
//   console.log(error, helperText);
//   return (
//     <div>
//       <label htmlFor={`dropDown__${name}`}>{fieldName}</label>
//       <select className='border-1 border-gray-400 w-full h-14 rounded pe-5 ' id={`dropDown__${name}`} name={name} onChange={selectHandle}>
//         {menuItems.map((item) => (
//           <option key={item} value={item}>{item}</option>
//         ))}
//       </select>
//       {error && <div>{helperText}</div>}
//     </div>
//   );
// }