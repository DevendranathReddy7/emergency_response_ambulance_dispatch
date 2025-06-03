import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import type { inputProps } from '../../dataModals/Common';

export default function Input({ id, label, name, value, datatestid, error, helperText, changeHandle }: inputProps) {
  return (
    <Box>
      {/* <label htmlFor={`dropDown__${name}`}>{label}</label> */}
      <TextField sx={{ width: '100%' }} id={id} name={name} label={label} value={value} data-testid={datatestid} error={error} helperText={error ? helperText : ''} onChange={changeHandle} />
    </Box>
  );
}
