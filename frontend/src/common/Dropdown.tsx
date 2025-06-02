import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { dropDownProps } from '../dataModals/Common';
import { FormHelperText } from '@mui/material';

export default function DropDown({ fieldName, name, menuItems, error, helperText, selectHandle }: dropDownProps) {

    return (
        <Box >
            <FormControl fullWidth error={error}>
                <InputLabel id={`input__${name}`}>{fieldName}</InputLabel>
                <Select
                    labelId={`dropDown__${name}`}
                    id={`dropDown__${name}`}
                    label={name}
                    onChange={selectHandle}
                >
                    {menuItems.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                    ))}
                </Select>
                {error && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        </Box>
    );
}
