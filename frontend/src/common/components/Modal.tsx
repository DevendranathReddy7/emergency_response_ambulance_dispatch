import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import type { ModalProps } from '../../dataModals/Common';
import MuiButton from './MuiButton';

export default function BasicModal({ isOpen, handleModal, confirmContent, handleConfirmation }: ModalProps) {
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isOpen}
        onClose={() => handleModal(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: 'lg', mb: 1 }}
          >
            {confirmContent.title}
            <hr />
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary">
            {confirmContent.content}
            <hr />
          </Typography>
          <div className='flex justify-between mt-3'>
            {confirmContent.buttons.map((btn) => (
              <MuiButton variant={btn === 'Cancel' ? 'outlined' : 'danger'} btnType='button' handleBtnClick={btn === 'Cancel' ? handleModal : handleConfirmation} >{btn}</MuiButton>
            ))}
          </div>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
