import { Box, TextField } from '@mui/material';
import type { inputProps } from '../../dataModals/Common';

export default function Input({ id, label, name, value, datatestid, error, helperText, changeHandle, readOnly }: inputProps) {
  return (
    <Box>
      <TextField
        sx={{
          width: '100%',
          '& .MuiInputBase-input.Mui-readOnly': {cursor: 'not-allowed'}}}
        id={id}
        name={name}
        label={label}
        value={value}
        data-testid={datatestid}
        error={error}
        helperText={error ? helperText : ''}
        onChange={changeHandle}
        // This makes the field read-only
        slotProps={{
          input: {
            readOnly: readOnly,
          },
        }}
      />
    </Box>
  );
}